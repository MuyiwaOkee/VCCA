"use client"

import { VisaChevronDownTiny, VisaChevronUpTiny, VisaErrorTiny } from '@visa/nova-icons-react';
import {
  Button,
  Combobox,
  DropdownContainer,
  Input,
  InputContainer,
  InputMessage,
  Label,
  Listbox,
  ListboxContainer,
  ListboxItem,
  Radio,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { UseComboboxState, UseComboboxStateChangeOptions, useCombobox } from 'downshift';
import { forwardRef, useEffect } from 'react';

export type ComboboxItem = { value: string };

type Props = {
  items: ComboboxItem[],
  id: string,
  label: string
  isRequired?: boolean,
  errorText: string | undefined,
  defaultItemIndex?: number
}

export const itemToString = (item: ComboboxItem | null) => (item ? item.value : '');

export const stateReducer = <ItemType,>(
  state: UseComboboxState<ItemType>,
  { type, changes }: UseComboboxStateChangeOptions<ItemType>
) =>
  // this prevents on mouse hover, the item in the list is automatic selected
  type === useCombobox.stateChangeTypes.ItemMouseMove || type === useCombobox.stateChangeTypes.MenuMouseLeave
    ? {
        ...changes, // default Downshift new state changes on item selection.
        highlightedIndex: state.highlightedIndex,
      }
    : changes;

  const ErrorCombobox = forwardRef<string | null, Props>(({ items, id, label, isRequired, errorText, defaultItemIndex }: Props, ref) => {
    const {
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    selectItem,
    highlightedIndex,
    inputValue,
    isOpen,
    selectedItem,
  } = useCombobox({
    items,
    itemToString,
    stateReducer,
    initialSelectedItem: defaultItemIndex ? items[defaultItemIndex] : null,
  });
  const { id: listboxId, ...listboxProps } = getMenuProps();

    // Expose the selected value via ref
     useEffect(() => {
      if (typeof ref === 'function') {
        ref(selectedItem?.value || null);
      } else if (ref) {
        ref.current = selectedItem?.value || null;
      }
    }, [selectedItem, ref]);

    return (
    <Utility vFlexCol vGap={12} className='w-full z-70'>
      <Combobox>
        <DropdownContainer className="v-flex v-flex-col v-gap-4">
          <Label {...getLabelProps()}>{label} {isRequired ? '(required)' : ''}</Label>
          <InputContainer className="v-flex-row">
            <Input
              aria-describedby="input-error-message"
              aria-haspopup="listbox"
              aria-invalid={errorText ? 'true' : 'false'}
              name={id}
              type="text"
              {...getInputProps({
                'aria-expanded': isOpen && items.length > 0,
                'aria-owns': listboxId,
                onChange: () => selectItem(null),
              })}
            />
            <Button
              aria-label="expand"
              buttonSize="small"
              colorScheme="tertiary"
              iconButton
              type='button'
              {...getToggleButtonProps()}
            >
              {isOpen ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />}
            </Button>
          </InputContainer>
          {errorText && !isOpen && (
            <InputMessage aria-atomic="true" aria-live="assertive" id="input-error-message" role="alert">
              <VisaErrorTiny />
              {errorText}
            </InputMessage>
          )}
        </DropdownContainer>
        <ListboxContainer style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <Listbox id={listboxId} {...listboxProps}>
            {items.map((item, index) => (
              <ListboxItem
                className={highlightedIndex === index ? 'v-listbox-item-highlighted' : ''}
                key={`error-combobox-${index}`}
                {...getItemProps({
                  'aria-selected': inputValue === item.value,
                  index,
                  item,
                })}
              >
                <UtilityFragment vFlexShrink0>
                  <Radio tag="span" />
                </UtilityFragment>
                {item.value}
              </ListboxItem>
            ))}
          </Listbox>
        </ListboxContainer>
      </Combobox>
    </Utility>
  )
});

export default ErrorCombobox