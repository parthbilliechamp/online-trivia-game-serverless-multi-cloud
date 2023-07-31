CREATE EXTERNAL TABLE IF NOT EXISTS `trivia_quiz_etl_db`.`team_score` (
    `game_id` string,
    `game_category` string,
    `game_date` string,
    `team_id` string,
    `team_name` string,
    `team_result` string,
    `team_score` int
) ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' WITH SERDEPROPERTIES ('field.delim' = ',') STORED AS INPUTFORMAT 'org.apache.hadoop.mapred.TextInputFormat' OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat' LOCATION 's3://glue-etl-target-trivia-game/teams_score/' TBLPROPERTIES ('classification' = 'csv');



CREATE EXTERNAL TABLE IF NOT EXISTS `trivia_quiz_etl_db`.`user_score` (
    `game_id` string,
    `game_category` string,
    `game_date` string,
    `user_email` string,
    `user_score` int
) ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' WITH SERDEPROPERTIES ('field.delim' = ',') STORED AS INPUTFORMAT 'org.apache.hadoop.mapred.TextInputFormat' OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat' LOCATION 's3://glue-etl-target-trivia-game/users_score/' TBLPROPERTIES ('classification' = 'csv');



CREATE OR REPLACE VIEW team_leaderboard AS
select team_id,
    team_name,
    sum(team_score) as total_score
from "team_score"
group by team_id,
    team_name
order by sum(team_score) desc;



CREATE OR REPLACE VIEW team_leaderboard AS
select team_name,
    "game_category",
    cast('2022-06-29' as date) as "game_date",
    sum(team_score) as total_score
from "team_score"
group by team_name,
    "game_category",
    cast('2022-06-29' as date)
order by sum(team_score) desc,
    team_name asc;



CREATE OR REPLACE VIEW user_leaderboard AS
select user_email,
    "game_category",
    cast('2018-05-29' as date) as "game_date",
    sum(user_score) as total_score
from "user_score"
group by user_email,
    "game_category",
    cast('2018-05-29' as date)
order by sum(user_score) desc;



create or replace view "top_teams" as
select distinct "team_name"
from (
        select "team_name"
        from "team_leaderboard"
        order by "total_score" desc
    )
limit 5;



create or replace view "top_users" as
select distinct "user_email"
from (
        select "user_email"
        from "user_leaderboard"
        order by "total_score" desc
    )
limit 5;