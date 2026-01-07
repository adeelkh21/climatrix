import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


export async function POST(req: Request) {
    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY || '',
        });

        const { message, history } = await req.json();

        // Load Context from info.txt
        const infoPath = path.join(process.cwd(), 'docs', 'eda', 'info.txt');
        let context = '';
        try {
            context = fs.readFileSync(infoPath, 'utf-8');
        } catch (error) {
            console.error('Error reading info.txt:', error);
            context = 'Context unavailable due to file read error.';
        }

        const systemPrompt = `
You are the expert AI assistant for the CLIMATRIX project.
Your knowledge comes ENTIRELY from the following context file ("info.txt").
Answer the user's question accurately based ONLY on this context.
If the answer is not in the context, say "I don't have that information in my records."
Be concise, research-oriented, and professional.

--- CONTEXT START ---
${context}
--- CONTEXT END ---
`;

        // Construct messages array with history
        const messages = [
            { role: "system", content: systemPrompt },
            ...history, // Previous messages
            { role: "user", content: message }
        ];

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages as any,
            temperature: 0.5,
            max_tokens: 500,
        });

        const reply = completion.choices[0]?.message?.content || "No response generated.";

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Groq API Error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
