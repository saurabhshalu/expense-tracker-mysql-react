import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignSetting } from "../redux/authSlice";

const SettingScreen = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth.setting);

  useEffect(() => {
    localStorage.setItem("setting", JSON.stringify(state));
  }, [state]);

  const handleChange = (event) => {
    dispatch(
      assignSetting({
        name: event.target.name,
        value: event.target.checked,
      })
    );
  };

  return (
    <div>
      <FormControl xs={12} component="fieldset" variant="standard">
        <FormLabel component="legend">Configure Visibility</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.balance || false}
                onChange={handleChange}
                name="balance"
              />
            }
            label="Balance In Home Screen"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.openingBalance || false}
                onChange={handleChange}
                name="openingBalance"
              />
            }
            label="Opening Balance"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.closingBalance || false}
                onChange={handleChange}
                name="closingBalance"
              />
            }
            label="Closing Balance"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.availableBalance || false}
                onChange={handleChange}
                name="availableBalance"
              />
            }
            label="Available Balance"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.moneyReceivedChart || false}
                onChange={handleChange}
                name="moneyReceivedChart"
              />
            }
            label="Money Received Chart"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
};

export default SettingScreen;
