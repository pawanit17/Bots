// ++PDIT: Documentation can be found here:https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/turncontext?view=botbuilder-ts-latest#activity
// ++PDIT: Adaptive Cards Schema: https://adaptivecards.io/explorer/

const restify = require('restify');
const botbuilder = require('botbuilder');

// ++PDIT: Add the reference to the AdaptorCards' JSON here.
const AddNumbersCard = require('./resources/AddNumbers.json');

// Create bot adapter, which defines how the bot sends and receives messages.
// ++PDIT: If the adapter is fed with an empty appId and appPassword, then the
// processActivity would be treated as a conversation/dialog via an Emulator. 
var adapter = new botbuilder.BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Create HTTP server.
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
});
 
// Listen for incoming requests at /api/messages.
server.post('/api/messages', (req, res) => {
    // Use the adapter to process the incoming web request into a TurnContext object.
    // ++PDIT: TurnContext object represents the bot's 'turn', in a conversation flow.
    adapter.processActivity(req, res, async (turnContext) => {
        // Do something with this incoming activity!

        if ( turnContext.activity.type === 'message' ) {
            // Get the user's text
            const utterance = turnContext.activity.text;
 
            if( turnContext.activity.channelData.postBack ) {

              // AdaptiveCard submit operation.
              var number1 = turnContext.activity.value.firstNumber;
              var number2 = turnContext.activity.value.secondNumber;

              var sum = Number(number1) + Number(number2);
              await turnContext.sendActivity( 'The sum of the entered numbers is ' + sum );
            }
            else {
              if ( utterance === 'add' ) {
                  // send a reply
                  await turnContext.sendActivity( {
                    text: 'Here is an Adaptive Card:',
                    attachments:[botbuilder.CardFactory.adaptiveCard(AddNumbersCard)] 
                  });
              }
              else {
                  // send a reply
                  await turnContext.sendActivity(`I heard you say ${ utterance }`);
              
                  // By calling next() you ensure that the next BotHandler is run.
                  await next();
              }
            }
        }
    });
});