import { ProgressCircular, ProgressLabel, Typography, Utility } from '@visa/nova-react';

type Props = {
    id: string
    progressValue: number,
    loadingMsg?: string
}

export const DeterminateCircularProgress = ({ id, progressValue, loadingMsg }: Props) => {
return (
    <>
      <ProgressCircular aria-labelledby={id} value={progressValue} aria-valuenow={progressValue}>
        <ProgressLabel id={id}>
          <Typography tag="div" className="v-progress-label" variant="body-2-bold">{progressValue}%</Typography>
        </ProgressLabel>
      </ProgressCircular>
      {/* <Utility tag="span" role="alert" className="v-sr">{loadingMsg}</Utility> */}
    </>
  );
};