const openai = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize OpenAI API key
openai.apiKey = process.env.OPENAI_API_KEY;

// List of TV series to choose from
const seriesList = ['Friends', 'Stranger Things', 'Parks and Recreation', 'Brooklyn Nine-Nine'];

// Pick a random series
const selectedSeries = seriesList[Math.floor(Math.random() * seriesList.length)];

// Fetch quotes from OpenAI's GPT model
async function fetchQuotes(series) {
  const response = await openai.Completion.create({
    model: 'gpt-4', // You can also use gpt-3.5-turbo
    prompt: `Generate 3 quotes from the TV series "${series}" and who said it with emojis.`,
    max_tokens: 100,
    temperature: 0.7,
  });

  return response.choices[0].text;
}

// Update README.md with generated quotes
async function updateReadme() {
  const readmeTemplatePath = path.join(process.cwd(), './README.template.md');
  const readmeTemplate = fs.readFileSync(readmeTemplatePath, 'utf8');

  const quotes = await fetchQuotes(selectedSeries);

  // Inject quotes into README template
  const updatedReadme = readmeTemplate.replace('{{quotes}}', quotes);

  // Write the updated README to the repository
  fs.writeFileSync('README.md', updatedReadme);
  console.log('README.md updated with new quotes');
}

updateReadme().catch((error) => {
  console.error('Error updating README:', error);
});
