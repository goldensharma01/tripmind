const Groq = require('groq-sdk');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const extractFromDocument = async (filePath, mimetype) => {
  try {
    let content = '';

    if (mimetype === 'application/pdf') {
      const fileBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(fileBuffer);
      content = pdfData.text;

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Extract the following fields from this travel document and return ONLY a valid JSON object with no extra text, no markdown, no code blocks:
            { "flightNumber": "", "airline": "", "origin": "", "destination": "", "departureDate": "", "departureTime": "", "arrivalTime": "", "passengerName": "", "hotelName": "", "checkIn": "", "checkOut": "", "bookingRef": "", "documentType": "" }
            
            Document text:
            ${content}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      });

      const raw = response.choices[0].message.content.trim();
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } else {
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = mimetype;

      const response = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
              {
                type: 'text',
                text: `Extract the following fields from this travel document image and return ONLY a valid JSON object with no extra text, no markdown, no code blocks:
                { "flightNumber": "", "airline": "", "origin": "", "destination": "", "departureDate": "", "departureTime": "", "arrivalTime": "", "passengerName": "", "hotelName": "", "checkIn": "", "checkOut": "", "bookingRef": "", "documentType": "" }`,
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      });

      const raw = response.choices[0].message.content.trim();
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    }
  } catch (error) {
    console.error('Extraction error:', error);
    return {};
  }
};

const generateItinerary = async (extractedDataArray, destination, days) => {
  try {
    const bookingsSummary = JSON.stringify(extractedDataArray, null, 2);

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are an expert travel planner. Based on the following booking details, generate a detailed day-by-day travel itinerary.

Booking details:
${bookingsSummary}

Destination: ${destination}
Number of days: ${days}

Return ONLY a valid JSON object with no extra text, no markdown, no code blocks:
{
  "title": "Trip title",
  "destination": "${destination}",
  "days": [
    {
      "dayNumber": 1,
      "title": "Day title",
      "activities": ["Activity 1", "Activity 2", "Activity 3"]
    }
  ]
}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const raw = response.choices[0].message.content.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error('Itinerary generation error:', error);
    return null;
  }
};

module.exports = {
  extractFromDocument,
  generateItinerary,
};
