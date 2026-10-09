# Connecting Sidra Assistant to AI with n8n (optional)

The website already has a free built-in assistant. This guide connects it to an AI model through
[n8n](https://n8n.io), so it can answer open-ended questions. If n8n is ever unreachable, the website
automatically falls back to the built-in answers.

```
Website (GitHub Pages)  ──question──▶  n8n Webhook  ──▶  AI Agent (Claude)  ──▶  Respond to Webhook
        ▲                                                                                │
        └───────────────────────────────── reply ◀───────────────────────────────────────┘
```

> **Costs:** n8n Cloud has a free trial, then a monthly plan (self-hosting n8n is free but needs a
> public server). The AI model needs an API key with credit, e.g. from console.anthropic.com.
> Keep the key inside n8n only. Never put it in the website code.

## 1. Create the workflow
1. Sign in at **n8n.io** and click **Create Workflow**. Name it `Sidra Assistant`.

## 2. Webhook node (receives the question)
1. Click **+** and add a **Webhook** node.
2. **HTTP Method:** `POST`
3. **Path:** `sidra-chat`
4. **Respond:** `Using 'Respond to Webhook' Node`
5. **Options → Add option → Allowed Origins (CORS):**
   `https://josephyaa.github.io,http://localhost:8000`

The website sends this JSON body:
```json
{ "question": "...", "lang": "en" or "ar", "history": [ ... ], "results": { ...summary of the two results files... } }
```

## 3. AI Agent node (writes the answer)
1. Add an **AI Agent** node after the Webhook.
2. **Source for Prompt (User Message):** `Define below`
3. **Prompt (User Message):** `{{ $json.body.question }}`
4. **Options → System Message:** paste this:

```
You are Sidra's assistant on a hackathon website by Team Sidra (American University of Bahrain), Theme 05: Sustainable Urban Planning & Smart Cities.
Sidra uses summer Landsat, Sentinel-2, annual land-cover and ERA5 weather data (1995-2025) to study surface heat on reclaimed land
at Diyar Al Muharraq, Bahrain: before/after heat relative to open sea, persistent hotspots, nearby existing land, and a field-visit shortlist.

Latest project results (JSON): {{ JSON.stringify($json.body.results) }}

Rules:
- Reply in {{ $json.body.lang === "ar" ? "Arabic" : "English" }}.
- Use the numbers in the results exactly. Never invent measurements.
- Landsat measures late-morning surface temperature, not air temperature. The comparisons cannot by themselves prove that reclamation caused the change, and the nearby-land interval includes zero. Say so when relevant.
- You may give general, well-established urban-heat advice (trees, shade, water channels, reflective surfaces).
- Keep answers short (2-5 sentences), friendly and in plain language.
- If a question is unrelated to Sidra, urban heat or the project, politely steer back.
```

5. Under the AI Agent, click **Chat Model → +** and choose **Anthropic Chat Model**.
   - **Credential:** create one and paste your Anthropic API key.
   - **Model:** pick a Claude model from the list (for example Claude Opus 5.5; Claude Haiku 4.5 is the cheapest).

## 4. Respond to Webhook node (sends the answer back)
1. Add a **Respond to Webhook** node after the AI Agent.
2. **Respond With:** `JSON`
3. **Response Body:** `{{ { "reply": $json.output } }}`

## 5. Turn it on and connect the website
1. Save the workflow and switch it to **Active** (top right).
2. Open the Webhook node and copy the **Production URL**
   (looks like `https://YOUR-NAME.app.n8n.cloud/webhook/sidra-chat`).
3. In VS Code open `assets/js/assistant.js` and paste it at the top:
   ```js
   const CHAT_WEBHOOK_URL = "https://YOUR-NAME.app.n8n.cloud/webhook/sidra-chat";
   ```
4. Save, then `git add .`, `git commit -m "Connect AI assistant"`, `git push`.

## Test it
Ask something the built-in assistant can't answer, e.g. *"If we add 10% more trees, roughly how much could the temperature change?"*.
If you get the "I don't have a precise answer" message, check:
- the workflow is **Active**, and you used the **Production** URL (not the Test URL);
- **Allowed Origins (CORS)** includes your site address;
- the Anthropic credential has credit.

> Anyone who visits the site can use the webhook, so keep an eye on your API usage, and turn
> the workflow off after the hackathon.
