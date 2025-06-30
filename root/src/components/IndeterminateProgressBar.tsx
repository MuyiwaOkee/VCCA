import { ProgressLabel, ProgressLinear, Utility, UtilityFragment } from '@visa/nova-react';

type Props = {
    id: string,
    loadingMsg?: string,
    className?: string
}

export const IndeterminateProgress = ({ id, loadingMsg, className }: Props) => {
  return (
    <Utility vFlexCol vGap={12} className={className}>
        <Utility vFlexGrow>
        <UtilityFragment vMarginVertical={8}>
          <ProgressLinear id={id} />
        </UtilityFragment>
        <ProgressLabel htmlFor={id}>
          <Utility tag="span" role="alert">{loadingMsg}</Utility>
        </ProgressLabel>
      </Utility>
    </Utility>
  );
};