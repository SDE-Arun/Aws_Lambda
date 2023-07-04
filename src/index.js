const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const dotenv = require("dotenv");
dotenv.config();

const tableName = process.env.USERS_TABLE_NAME;
const indexName = process.env.USERS_INDEX_NAME;
const awsRegion = process.env.AWS_REGION;

async function getTopicByDate(dateBegin, dateEnd) {
  const client = new DynamoDBClient({ region: awsRegion });
  try {
    const d = new Date();
    if (
      dateBegin === undefined ||
      dateEnd === undefined ||
      dateEnd > d.toISOString()
    ) {
      throw "Invalid Credentials";
    }
    const input = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression:
        "#st = :statusValue and createdAt BETWEEN :rkey1 and :rkey2",
      ExpressionAttributeNames: {
        "#st": "status",
      },
      ExpressionAttributeValues: {
        ":statusValue": { S: "CLOSED" },
        ":rkey1": { S: dateBegin },
        ":rkey2": { S: dateEnd },
      },
    };
    const response = await client.send(new QueryCommand(input));
    console.log(response.Items.length);
    const stringCounts = response.Items.map((elem) => {
      if (elem.hasOwnProperty("topic")) {
        return elem["topic"]["S"];
      }
    });

    const counts = new Map();

    for (let i = 0; i < stringCounts.length; i++) {
      const element = stringCounts[i];

      if (counts.has(element)) {
        counts.set(element, counts.get(element) + 1);
      } else {
        counts.set(element, 1);
      }
    }
    console.log(counts);
    // counts.clear();
  } catch (err) {
    console.error(err);
  }
}
getTopicByDate("2022-10-05T04:38:45.354Z", "2023-07-04T05:08:45.354Z");
