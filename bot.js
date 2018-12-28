//Discord.JS
const Discord = require("discord.js");
const client = new Discord.Client();

//Node-Hue-API
var hue = require("node-hue-api"),
	HueApi = hue.HueApi,
	lightState = hue.lightState;

//Display command results in console
var displayResult = function(result) {
	console.log(JSON.stringify(result, null, 2));
};

//Function taken from campushippo.com
var rgbToHex = function (rgb) { 
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

//Function taken from campushippo.com
var fullColorHex = function(r,g,b) {   
  var header = "0x"
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return header+red+green+blue;
};

//Declarations
var host = "BRIDGE IP GOES HERE",
	username = "BRIDGE USERNAME GOES HERE",
	api = new HueApi(host, username),
	state = lightState.create(),
	prefix = "~",
	lightNum = "LIGHT NUMBER GOES HERE";

//Bot code
client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
	if (message.author.bot) return; //Ignore bot messages
	if (message.content.indexOf(prefix) !== 0) return; //Ensure prefix is at the beginning

	const args = message.content.slice(prefix.length).trim().split(/ +/g); //Split command into arguments
	const command = args.shift().toLowerCase(); 

	switch (command) {
		case "light.off" :
			api.setLightState(lightNum, state.off())
		       .then(displayResult)
		       .done();
			message.channel.send("Light Off!");
			break;
		case "light.on" :
			api.setLightState(lightNum, state.on())
			   .then(displayResult)
			   .done();
			message.channel.send("Light On!");
			break;
		case "light.rgb" :
			let r = args[0];
			let g = args[1];
			let b = args[2];
			api.setLightState(lightNum, state.on().rgb(r, g, b))
			   .then(displayResult)
			   .done();
			const embed = new Discord.RichEmbed()
				.setTitle('Light Colour Change')
				.setColor(fullColorHex(r, g, b))
				.setDescription(`Red Value: ${r}. Green Value: ${g}. Blue Value: ${b}`);
			message.channel.send(embed);
			break;
	}
});

//Use your own token - Bot login
client.login('TOKEN GOES HERE')
