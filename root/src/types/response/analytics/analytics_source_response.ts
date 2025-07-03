export type analytics_source_response = {
    id: string,
    category_name: string,
    sector_name: string,
    country_iso_code: string,
    value_is_percent: boolean,
    currency_iso_code: string,
    description: string | null,
    period: "monthly" | "quarterly",
    unit: string,
    stroke_hex: string,
    fill_hex: string
}