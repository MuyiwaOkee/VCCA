import { datapoints_response } from "@/types/response/analytics/datapoints_response";

// Maps the month text to a number
type MonthName =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December"
  | (string & {});

const monthToNumber: Record<MonthName, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};


type ForcastDataEntry = {
    year_0: number;
    year_1: number | null;
    year_2: number| null;
    income_0: number;
    income_1: number| null;
    income_2: number| null;
    interest_0: number;
    interest_1: number| null;
    interest_2: number| null;
    month_0: number;
    month_1: number| null;
    month_2: number| null;
    unemployment_0: number;
    unemployment_1: number| null;
    unemployment_2: number| null;
}

type RequestType = {
    year: (number | null)[];
    month: (number | null)[];
    mean_desposible_income: (number | null)[];
    interest_rate: (number | null)[];
    unemployment_rate: (number | null)[]
}

export const GetForecast = async (_prevState: any, formData: FormData) => {
    const rawFormData = Object.fromEntries(formData);

    // format the form data
    const formDataObject: ForcastDataEntry = {
        year_0: Number(rawFormData.year_0),
        year_1: rawFormData.year_1 ? Number(rawFormData.year_1) : null,
        year_2: rawFormData.year_2 ? Number(rawFormData.year_2) : null,
        income_0: Number(rawFormData.income_0),
        income_1: rawFormData.income_1 ? Number(rawFormData.income_1) : null,
        income_2: rawFormData.income_2 ? Number(rawFormData.income_2) : null,
        interest_0: Number(rawFormData.interest_0),
        interest_1: rawFormData.interest_1 ? Number(rawFormData.interest_1) : null,
        interest_2: rawFormData.interest_2 ? Number(rawFormData.interest_2) : null,
        month_0: monthToNumber[String(rawFormData.month_0)],
        month_1: rawFormData.month_1 ? monthToNumber[String(rawFormData.month_1)] : null,
        month_2: rawFormData.month_2 ? monthToNumber[String(rawFormData.month_2)] : null,
        unemployment_0: Number(rawFormData.unemployment_0),
        unemployment_1: rawFormData.unemployment_1 ? Number(rawFormData.unemployment_1) : null,
        unemployment_2: rawFormData.unemployment_2 ? Number(rawFormData.unemployment_2) : null,
    };

    // fetch predictions
    try {
        const request_body:RequestType = {
            year: [formDataObject.year_0, formDataObject.year_1, formDataObject.year_2],
            month: [formDataObject.month_0, formDataObject.month_1, formDataObject.month_2],
            mean_desposible_income: [formDataObject.income_0, formDataObject.income_1, formDataObject.income_2],
            interest_rate: [formDataObject.interest_0, formDataObject.income_1, formDataObject.income_2],
            unemployment_rate: [formDataObject.unemployment_0, formDataObject.unemployment_1, formDataObject.unemployment_2]
        }
        
        const response = await fetch(`http://127.0.0.1:8000/predict/`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(request_body)
        });

        if(!response.ok) 
            switch (response.status) {
                case 404 | 400 | 422:
                    throw new Error("Invalid data prodvided");
                    break;
            
                default:
                    throw new Error("Problem with server. Please try again later");
                    break;
            }

        // check response
        const data = (await response.json()) as datapoints_response;

        console.log('Here are the predictions', data);

        return data

    } catch (error) {
        console.log(error)
    }
}