const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

async function main() {
  const modelsToTry = [
    "openrouter/free",
    "stepfun/step-3.5-flash:free",
  ];

  for (const model of modelsToTry) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 120,
      });
      console.log(`[${model}]`, completion.choices[0].message.content);
      return;
    } catch (err) {
      if (err?.status === 404 && String(err?.error?.message || "").includes("guardrail restrictions")) {
        console.log("OpenRouter privacy/guardrail filter e kono endpoint match kortese na.");
        console.log("Fix: https://openrouter.ai/settings/privacy");
      } else {
        console.log(`[${model}] failed:`, err?.error?.message || err.message);
      }
    }
  }

  console.log("Kono free model diye response paini.");
}
main().catch(console.error);


// const OpenAI = require("openai");
// const fs = require("fs");
// const https = require("https");
// const { exec } = require("child_process");
// require("dotenv").config();

// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPEN_ROUTER_API_KEY,
// });

// async function main() {
//   const completion = await openai.chat.completions.create({
//     model: "google/gemini-2.5-flash-image",
//     messages: [{ role: "user", content: "Generate a man photo" }],
//     max_tokens: 30,
//   });

//   const msg = completion.choices[0].message;
//   const outputPath = "cat.png";
//   const openFile = () => exec(`start "" "${outputPath}"`);
//   const saveBase64 = (value) => fs.writeFileSync(outputPath, Buffer.from(value, "base64"));
//   const saveFromUrl = (url) =>
//     new Promise((resolve, reject) => {
//       https
//         .get(url, (res) => {
//           if (res.statusCode !== 200) {
//             reject(new Error(`Image download failed: ${res.statusCode}`));
//             return;
//           }
//           const chunks = [];
//           res.on("data", (c) => chunks.push(c));
//           res.on("end", () => {
//             fs.writeFileSync(outputPath, Buffer.concat(chunks));
//             resolve();
//           });
//         })
//         .on("error", reject);
//     });

//   if (typeof msg.content === "string") {
//     const urlMatch = msg.content.match(/https?:\/\/\S+/);
//     if (urlMatch) {
//       await saveFromUrl(urlMatch[0]);
//       console.log("Saved cat.png from URL");
//       openFile();
//       return;
//     }
//   }

//   const imageItems = Array.isArray(msg.images) ? msg.images : [];
//   for (const img of imageItems) {
//     const dataUrl = img?.image_url?.url;
//     if (typeof dataUrl === "string" && dataUrl.startsWith("data:image/")) {
//       saveBase64(dataUrl.split(",")[1]);
//       console.log("Saved cat.png from message.images");
//       openFile();
//       return;
//     }
//     if (typeof dataUrl === "string" && /^https?:\/\//.test(dataUrl)) {
//       await saveFromUrl(dataUrl);
//       console.log("Saved cat.png from message.images URL");
//       openFile();
//       return;
//     }
//   }

//   const parts = Array.isArray(msg.content) ? msg.content : [];
//   for (const p of parts) {
//     const dataUrl = p?.image_url?.url;
//     if (typeof dataUrl === "string" && dataUrl.startsWith("data:image/")) {
//       saveBase64(dataUrl.split(",")[1]);
//       console.log("Saved cat.png from base64");
//       openFile();
//       return;
//     }
//     const imageBase64 = p?.image_base64 || p?.b64_json;
//     if (typeof imageBase64 === "string" && imageBase64.length > 100) {
//       saveBase64(imageBase64);
//       console.log("Saved cat.png from image_base64");
//       openFile();
//       return;
//     }
//     const partText = p?.text;
//     if (typeof partText === "string") {
//       const urlMatch = partText.match(/https?:\/\/\S+/);
//       if (urlMatch) {
//         await saveFromUrl(urlMatch[0]);
//         console.log("Saved cat.png from part text URL");
//         openFile();
//         return;
//       }
//     }
//   }

//   console.log("Image paoa jai nai. Response text:", msg.content);
// }

// main().catch(console.error);
