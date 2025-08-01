import { Input, InputContainer, InputMessage, Label, Utility } from '@visa/nova-react';

// TIP: Customize this ID, pass it as a prop, or auto-generate it with useId() from @react
type Props = {
    id: string,
    label: string
    isRequired?: boolean,
    description?: string,
    autocomplete?: string
}

export const DefaultInput = ({ id, label, isRequired = false, description, autocomplete }: Props) => {
  return (
    <Utility vFlex vFlexCol vGap={4} className='w-full'>
      <Label htmlFor={id}>{label} {isRequired ? '(required)' : ''}</Label>
      <InputContainer>
        <Input aria-required={isRequired} id={id} name={id} type="text" autoComplete={autocomplete}/>
      </InputContainer>
      {description && <InputMessage id={`${id}-message`}>{description}</InputMessage>}
    </Utility>
  );
};