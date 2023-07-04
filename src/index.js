const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

async function getTopicByDate() {
  const client = new DynamoDBClient({ region: "ap-south-1" });
  try {
    const input = {
      TableName: "Conversation-t4cbmefepvafblwu43bufhgtiy-prd",
      IndexName: "byStatusAndCreatedAt",
      KeyConditionExpression: "#st = :statusValue and createdAt > :rkey",
      ExpressionAttributeNames: {
        "#st": "status",
      },
      ExpressionAttributeValues: {
        ":statusValue": { S: "CLOSED" },
        ":rkey": { S: "2022-08-05T05:38:45.354Z" },
      },
    };
    const response = await client.send(new QueryCommand(input));
    console.log(response.Items.length);
    const stringCounts = response.Items.map((elem) => {
      if (elem.hasOwnProperty("topic")) {
        return elem["topic"]["S"];
      }
    });

  //   const counts = {};

  //   for (let i = 0; i < stringCounts.length; i++) {
  //     const element = stringCounts[i];

  //     if (counts[element]) {
  //       counts[element] += 1;
  //     } else {
  //       counts[element] = 1;
  //     }
  //   }
  //   console.log(counts);

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
  } catch (err) {
    console.error(err);
  }


}
getTopicByDate();