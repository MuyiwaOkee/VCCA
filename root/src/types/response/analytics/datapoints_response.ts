import { analytics_datapoint_response } from "./analytics_datapoint_response";

export type datapoints_response = {
    stroke_hex: string;
    fill_hex: string;
    data: analytics_datapoint_response[];
    is_value_percent:Boolean;
    source_id?: string,
    unit: string
}