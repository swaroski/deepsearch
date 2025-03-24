
/*
import { NextResponse } from "next/server";
import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from "zod";


const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
  });

const clarifyResearchGoals = async (topic: string) => {

    const prompt = `
    Given the research topic <topic>${topic}</topic>, generate 2-4 clarifying questions to help narrow down the research scope. Focus on identifying:
    - Specific aspects of interest
    - Required depth/complexity level
    - Any particular perspective or excluded sources
    `

    try{
        const { object } = await generateObject({
            model: openrouter("meta-llama/llama-3.3-70b-instruct"),
            prompt,
            schema: z.object({
                questions: z.array(z.string())
            })
          });

          return object.questions;
    }catch(error){
    console.log("Error while generating questions: ", error)

    }
}


export async function POST(req: Request){

    const {topic} = await req.json();
    console.log("Topic: ", topic);

    try{
           const questions = await clarifyResearchGoals(topic);
           console.log("Questions: ", questions)

           return NextResponse.json(questions)
    }catch(error){

       console.error("Error while generating questions: ", error)
        return NextResponse.json({
            success: false, error: "Failed to generate questions"
        }, {status: 500})

    }


   
}

*/ 



import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from "zod";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const clarifyResearchGoals = async (topic: string) => {
  const prompt = `
  Given the research topic <topic>${topic}</topic>, generate 2 to 4 thoughtful clarifying questions that would help refine and narrow the research scope for a more focused and effective investigation. These questions should aim to uncover:
 - Specific aspects of interest (e.g., time period, geographic region, demographic group, domain, subfield, or particular angle)
 - Required depth or complexity (e.g., foundational overview vs. advanced analysis, qualitative vs. quantitative approach, theoretical vs. practical application)
 - Preferred perspectives or excluded viewpoints (e.g., economic, psychological, historical, ethical, etc.)
 - Any limitations or constraints (e.g., sources to avoid, regions to exclude, technologies not to consider)
The goal is to help the researcher move from a broad topic to a clearly defined research question or thesis direction. Frame your questions as if you were guiding a student or collaborator through their early research design process.
  `;

  try {
    const { object } = await generateObject({
      model: openrouter("google/gemini-2.0-flash-001"),
      prompt,
      schema: z.object({
        questions: z.array(z.string())
      })
    });

    return object.questions;
  } catch (error) {
    console.log("Error while generating questions: ", error);
    throw error;
  }
};

export async function POST(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { topic } = await req.json();
        console.log("Topic: ", topic);

        const questions = await clarifyResearchGoals(topic);
        console.log("Questions: ", questions);

        controller.enqueue(encoder.encode(JSON.stringify(questions)));
        controller.close();
      } catch (error) {
        console.error("Streaming error: ", error);
        controller.enqueue(encoder.encode(JSON.stringify({
          success: false,
          error: "Failed to generate questions"
        })));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    }
  });
}
