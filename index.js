require('isomorphic-unfetch');
const { promises: fs } = require('fs');
const path = require('path');

async function main() {
  try {
    // Read the README template
    const readmeTemplate = (
      await fs.readFile(path.join(process.cwd(), './README.template.md'))
    ).toString('utf8');

    // Fetch the random quote from the updated endpoint
    const response = await fetch('https://officeapi.akashrajpurohit.com/quote/random');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Extract the quote and character information
    const quote = data.quote;
    const character = data.character;

    // Replace placeholders in the template
    const readme = readmeTemplate
      .replace('{{office_quote}}', quote)
      .replace('{{office_quoted_by}}', character);

    // Write the final README file
    await fs.writeFile('README.md', readme);
    console.log('README.md generated successfully!');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
