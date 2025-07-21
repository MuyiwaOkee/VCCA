import { StateType } from "@/components/TextModal";
import OpenAI from "openai";

type GenerateForcastReportProps = {
    setTextModalState: (state: StateType) => void
}

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
    dangerouslyAllowBrowser: true,
});

const tokenLimit = 1000

export const GenerateForcastReport = async ({ setTextModalState }: GenerateForcastReportProps) => {
  setTextModalState({
    state: 'loading',
    message: 'Loading',
    progressValue: 0
  });

  let message = '';
  let tokensReceived = 0;

  const completion = await openai.chat.completions.create({
      messages: [
          // { role: "system", content: `` },
          {role: "user", content: `Tell me more about how you work`}
      ],
      model: "deepseek-chat",
      temperature: 0.5,
      stream: true,
      max_completion_tokens: tokenLimit
  });

  //handles the streamed response
    for await (const part of completion) {
        const output = part.choices[0]?.delta?.content;

        if(output == null || output == undefined) continue

      message += output;

      // Better token counting - use the API's reported usage if available
      tokensReceived = part.usage?.completion_tokens || tokensReceived + 1;
      
      // Calculate progress (ensure it doesn't exceed 100%)
      const progress = Math.min(Math.floor((tokensReceived / tokenLimit) * 100), 100);

      console.log(`Current Progress: ${progress}%`);

      setTextModalState({
        state: 'loading',
        message: '',
        progressValue: progress
      });
  }

  setTextModalState({
      state: 'viewing',
      message,
      progressValue: 0
  });
}