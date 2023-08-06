const AWS = require('aws-sdk');
const axios = require('axios');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (inputEvent) => {
    console.log(inputEvent);
    const sessionAttributes = inputEvent.sessionState.sessionAttributes || {};
    const extractedIntent = inputEvent.interpretations[0].intent;
    const labelIntent = extractedIntent.name;
    const allSlots = extractedIntent.slots;
    const groupIdentifier = allSlots.teamName;

    let dialogData = {}; // Initialize dialogData
    let responseDetails = { name: labelIntent };
    let contentResponse = [];

    if (labelIntent === 'PageNavigation') {
        const pageName = allSlots.pagename.value.originalValue;
        console.log(pageName);
        if (!pageName) {
            // If "pagename" slot value is not provided, elicit the slot from the user
            dialogData.type = 'ElicitSlot';
            dialogData.slotToElicit = 'pagename';
            dialogData.intentName = labelIntent;
            dialogData.slots = allSlots;
            responseDetails.confirmationState = 'None';
            responseDetails.state = 'InProgress';

            contentResponse.push({
                contentType: 'PlainText',
                content: 'Please provide the name of the page you want to navigate to.'
            });
        } else {
            // If "pagename" slot value is provided, proceed with fetching data from DynamoDB
            const navigationParams = {
                TableName: 'navigation',
                Key: { page: pageName }
            };

            try {
                const navigationResponse = await dynamoDB.get(navigationParams).promise();
                const pageUrl = navigationResponse.Item ? navigationResponse.Item.url : null;
                
                if (pageUrl) {
                    contentResponse.push({
                        contentType: 'PlainText',
                        content: `Here is the link to the ${pageName} page: ${pageUrl}`
                    });
                } else {
                    contentResponse.push({
                        contentType: 'PlainText',
                        content: `The page ${pageName} does not exist.`
                    });
                }
            } catch (error) {
                contentResponse.push({
                    contentType: 'PlainText',
                    content: `Error fetching page navigation data.`
                });
                console.error(error);
            }

            // Set dialogData type to 'Close' to end the conversation
            dialogData.type = 'Close';
            responseDetails.confirmationState = 'Confirmed';
            responseDetails.state = 'Fulfilled';
        }
    } else if (labelIntent === 'leaderboard') {
        // Fetch the top teams from the first API endpoint
        const leaderboardApiUrl = 'https://s90mn5ladf.execute-api.us-east-1.amazonaws.com/topteams';

        try {
            const leaderboardResponse = await axios.get(leaderboardApiUrl);
            const topTeams = leaderboardResponse.data.team_names;

            if (topTeams.length === 0) {
                contentResponse.push({
                    contentType: 'PlainText',
                    content: `No top teams found.`
                });
            } else {
                // Fetch the score for each team from the second API endpoint
                let leaderboardTable = `Team Name | Score\n`;
                for (const teamName of topTeams) {
                    const apiUrl = `https://tahlvi1agg.execute-api.us-east-1.amazonaws.com/dev/get-team-stats?team_name=${encodeURIComponent(teamName)}`;
                    try {
                        const apiResponse = await axios.get(apiUrl);
                        const teamObject = apiResponse.data;
                        if (teamObject && teamObject.team_total_score) {
                            leaderboardTable += `${teamName} | ${teamObject.team_total_score}\n`;
                        } else {
                            leaderboardTable += `${teamName} | N/A\n`;
                        }
                    } catch (error) {
                        leaderboardTable += `${teamName} | N/A\n`;
                        console.error(error);
                    }
                }
                contentResponse.push({
                    contentType: 'PlainText',
                    content: leaderboardTable
                });
            }
        } catch (error) {
            contentResponse.push({
                contentType: 'PlainText',
                content: `Error fetching leaderboard data.`
            });
            console.error(error);
        }

        // Set dialogData type to 'Close' to end the conversation
        dialogData.type = 'Close';
        responseDetails.confirmationState = 'Confirmed';
        responseDetails.state = 'Fulfilled';

    } else if (!sessionAttributes.teamName && !groupIdentifier) {
        // For the existing intent (getScore), prompt for the team name if not provided
        dialogData.type = 'ElicitSlot';
        dialogData.slotToElicit = 'teamName'; // Corrected the slot name to 'teamName'
        dialogData.intentName = labelIntent;
        dialogData.slots = allSlots;
        responseDetails.confirmationState = 'None';
        responseDetails.state = 'InProgress';

        contentResponse.push({
            contentType: 'PlainText',
            content: 'Kindly provide the name of the team.'
        });
    } else {
        // If team name is available in the session or group identifier, proceed to fetch the score
        const teamIdentifierValue = sessionAttributes.teamName || groupIdentifier.value.originalValue;
        const apiUrl = `https://tahlvi1agg.execute-api.us-east-1.amazonaws.com/dev/get-team-stats?team_name=${encodeURIComponent(teamIdentifierValue)}`;
        console.log(teamIdentifierValue);
        try {
            const apiResponse = await axios.get(apiUrl);
            const teamObject = apiResponse.data;

            if (!teamObject || !teamObject.team_total_score) {
                contentResponse.push({
                    contentType: 'PlainText',
                    content: `No scores found for the team.`
                });
            } else {
                let scoreMessage = `Score for team ${teamIdentifierValue} is ${teamObject.team_total_score} points.`;
                contentResponse.push({
                    contentType: 'PlainText',
                    content: scoreMessage
                });
            }
        } catch (error) {
            contentResponse.push({
                contentType: 'PlainText',
                content: `Team Does Not Exists.`
            });
            console.error(error);
        }

        // Set dialogData type to 'Close' to end the conversation
        dialogData.type = 'Close';
        responseDetails.confirmationState = 'Confirmed';
        responseDetails.state = 'Fulfilled';
    }

    return {
        sessionState: {
            sessionAttributes,
            dialogAction: dialogData,
            intent: responseDetails
        },
        messages: contentResponse
    };
};
