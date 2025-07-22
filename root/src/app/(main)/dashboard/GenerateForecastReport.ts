import { StateType } from "@/components/TextModal";
import { datapoints_response } from "@/types/response/analytics/datapoints_response";
import OpenAI from "openai";

type GenerateForcastReportProps = {
    prediction: datapoints_response,
    setTextModalState: (state: StateType) => void,
}

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
    dangerouslyAllowBrowser: true,
});

const tokenLimit = 1000

export const GenerateForcastReport = async ({ setTextModalState, prediction }: GenerateForcastReportProps) => {
  setTextModalState({
    state: 'loading',
    message: 'Accessing AI',
    progressValue: 0
  });

  let message = '';
  let tokensReceived = 0;

  const prediction_formatted = prediction.data.map(({ creation_date_utc, value }, key) => {
    return `${key}. ${creation_date_utc}: ${value} ,\n`
  }).join();

  const completion = await openai.chat.completions.create({
      messages: [
          // { role: "system", content: `` },
          {role: "user", content: `You are a finanical analyst. I am going to give to give you a list of predictons of monthly CHAPS uk credit spending on credit and debit cards across all catagorries. You are to take this data, and make business suggestions for VISA partners on how they should adjust theit spending and marketing strategies based on these predictions. 
            
          Here are the predictions, with the days of the start of each month and predictded value for that month: 
          
          ${prediction_formatted}`}
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