import { Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';

interface Props {
  activeStep: number;
}

const CheckoutWizard = ({ activeStep = 0 }: Props) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        step => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
};

export default CheckoutWizard;
