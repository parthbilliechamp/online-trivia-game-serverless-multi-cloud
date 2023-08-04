import json
import firebase_admin
from firebase_admin import credentials, firestore
import boto3

def get_firebase_key():
    print("=================================Inside Firebase==============================")
    secret_name = "firestore_db_key"
    region_name = "us-east-1" 
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_name)["SecretString"]
    firebase_key = json.loads(secret_value)
    return firebase_key

def lambda_handler(event, context):
    print(event)
    headers = {
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
    }
    try:
        print("========================Inside Try ============================")
        print("=========================Request Body =========================")
        # Parse the input from the frontend
        request_body = json.loads(event["body"])
        print(request_body)

        print("==================================Team ID=======================")
        team_id = request_body.get("team_id")
        print(team_id)

        print("==================================Action==========================")
        action = request_body.get("action")
        print(action)

        print("===================================user_id=========================")
        user_id = request_body.get("user_id")  
        print(user_id)

        firebase_key = get_firebase_key()

        if not firebase_admin._apps:
            cred = credentials.Certificate(firebase_key)
            firebase_admin.initialize_app(cred, {
                'projectId': 'trivia-392000',
            })

        db = firestore.client()

        print("=============================Team Ref============================")
        # Get the team document reference
        team_ref = db.collection("teams").document(team_id)
        print(team_ref)

        print("==================================Team data========================")
        team_data = team_ref.get().to_dict()
        print(team_data)

        print("==============================First user ================================")    
        first_user_id = team_data["users"][0] if "users" in team_data and len(team_data["users"]) > 0 else None
        second_user_id = team_data["users"][1] if "users" in team_data and len(team_data["users"]) > 0 else ""
        print(first_user_id)
        print("===========================Get Admin =======================")
        # Get the admin ID of the team
        admin_id = team_data["admin"]
        print(admin_id)


        # print("=====================================Outside If=======================")
        # Check if the user performing the action is the admin
        # if context.identity.cognito_identity_id == admin_id:

        print("-------------------------outside first if ------------------------")
        # Perform the specified action
        if action == "promote_to_admin":
            print("-------------------------inside first if-----------------------")
            # Check if the user to promote is already a team member
            if user_id in team_data["users"]:
                
                print("-------------------------inside second if-----------------------")
                print("-------------------------Updating user-----------------------")
                team_ref.update({
                    "admin": user_id
                })
                print("-------------------------Admin Updated-----------------------")
                response = {
                    "statusCode": 200,
                    'headers': headers,
                    "body": json.dumps("User promoted to admin successfully."),
                }
            else:
                print("-------------------------inside first else-----------------------")
                response = {
                    "statusCode": 400,
                    'headers': headers,
                    "body": json.dumps("User is not a team member."),
                }
            print("-------------------------Outside elif-----------------------")
        elif action == "remove_member":
            print("-------------------------Inside elif-----------------------")
            if user_id in team_data["users"]:
                print("-------------------------inside elif first if-----------------------")
                print("-------------------------Removing user-----------------------")
                team_ref.update({
                    "users": firestore.ArrayRemove([user_id])
                })
                if user_id == admin_id:
                    team_ref.update({
                    "admin": second_user_id
                    })
                print("-------------------------Removed user successfully-----------------------")
                response = {
                    "statusCode": 200,
                    'headers': headers,
                    "body": json.dumps("User removed from the team successfully."),
                }
                print("-------------------------inside first if ---Else -----------------------")
            else:
                print("-------------------------inside first elif's else-----------------------")
                response = {
                    "statusCode": 400,
                    'headers': headers,
                    "body": json.dumps("User is not a team member."),
                }
        elif action == "leave_team":
            print("-------------------------inside leave team elif-----------------------")
            if user_id in team_data["users"]:
                print("-------------------------inside leave team elif-----------------------")
                team_ref.update({
                    "users": firestore.ArrayRemove([user_id])
                })
                print("---------------------------user left team----------------------")
                response = {
                    "statusCode": 200,
                    'headers': headers,
                    "body": json.dumps("User left the team successfully."),
                }
            elif user_id == admin_id:
                print("-------------------------if user is admin and wnat to leave-----------------------")
                team_ref.update({
                    "admin": first_user_id
                })
                print("---------------------------admin left team----------------------")
                response = {
                    "statusCode": 200,
                    'headers': headers,
                    "body": json.dumps("Admin left the team successfully."),
                }
            else:
                print("--------------------------- left team else----------------------")
                response = {
                    "statusCode": 400,
                    'headers': headers,
                    "body": json.dumps("User is not a team member."),
                }
        else:
            print("---------------------------final else----------------------")
            response = {
                "statusCode": 400,
                'headers': headers,
                "body": json.dumps("Invalid action."),
            }
        # else:
        #     response = {
        #         "statusCode": 403,
        #         "body": json.dumps("You are not authorized to perform this action."),
        #     }

        return response

    except Exception as e:
        print("---------------------------Inside exeception----------------------")
        # Return an error response if any error occurs
        response = {
            "statusCode": 500,
            'headers': headers,
            "body": json.dumps(f"Error: {str(e)}"),
        }
        return response
