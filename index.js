require('isomorphic-unfetch');
const { promises: fs } = require('fs');
const path = require('path');

// Array of series names
const seriesList = ['Friends', 'Brooklyn Nine-Nine', 'Parks and Recreation', 'Stranger Things'];

// Select a random series from the list
const selectedSeries = seriesList[Math.floor(Math.random() * seriesList.length)];

async function main() {
  const readmeTemplate = (await fs.readFile(path.join(process.cwd(), './README.template.md'))).toString('utf8');

  // Fetch quotes from the randomly selected series
  const { quotes } = await (
    await fetch(`https://api.jsongpt.com/json?prompt=Generate 3 quotes from ${selectedSeries} series and give who said it with emojis&quotes=array of quotes`)
  ).json();

  // Format the quotes and inject them into the README template
  let quotesString = '';
  quotes.forEach((quote, index) => {
    quotesString += `
> "${quote.quote}"  
> &mdash; <cite>${quote.character}</cite> ${quote.emojis}\n\n`;
  });

  const readme = readmeTemplate.replace('{{quotes}}', quotesString);
  
  // Write the new README with the quotes
  await fs.writeFile('README.md', readme);
}

main();
