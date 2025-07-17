export const GetForecast = async (_prevState: any, formData: FormData) => {
    const formDataObject = Object.fromEntries(formData) //this transforms the form data into an object, with the names of the input as the keys, and the values as the values. then I have set the type

    console.log("hello there", formDataObject)
}