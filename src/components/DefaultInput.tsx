import { Input, InputContainer, Label, Utility } from '@visa/nova-react';

// TIP: Customize this ID, pass it as a prop, or auto-generate it with useId() from @react
type Props = {
    id: string,
    label: string
    isRequired?: boolean
}

export const DefaultInput = ({ id, label, isRequired = false }: Props) => {
  return (
    <Utility vFlex vFlexCol vGap={4}>
      <Label htmlFor={id}>{label} {isRequired ? '(required)' : ''}</Label>
      <InputContainer>
        <Input aria-required={isRequired} id={id} type="text" className='w-full' />
      </InputContainer>
    </Utility>
  );
};