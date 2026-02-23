import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Input } from "../input/input";
import { Button } from "../button/button";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Label } from "@/src/components/label/label";

interface IDateInputProps {
  label: string;
  value?: string | Date;
  onChange: (date: string) => void;
  error?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  infoText?: string;
}

export const DateInput = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  minDate,
  maxDate,
  infoText,
}: IDateInputProps) => {
  const [show, setShow] = useState(false);
  const dateValue = value ? new Date(value) : new Date();

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (selectedDate) {
      onChange(selectedDate.toISOString());
    }
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR");
  };

  return (
    <View style={{ width: "100%" }}>
      <Label text={label} infoText={infoText} />
      <TouchableOpacity activeOpacity={0.7} onPress={() => setShow(true)}>
        <View pointerEvents="none">
          <Input
            placeholder={placeholder || "__/__/____"}
            value={formatDate(value)}
            error={error}
            editable={false}
          />
        </View>
      </TouchableOpacity>

      {show && Platform.OS === "ios" && (
        <Modal transparent animationType="fade" visible={show}>
          <TouchableWithoutFeedback onPress={() => setShow(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <DateTimePicker
                    value={dateValue}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    textColor={DEFAULT_COLORS.white}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                  />
                  <Button
                    text="Confirmar"
                    variant="tertiary"
                    onPress={() => setShow(false)}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {show && Platform.OS === "android" && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    backgroundColor: DEFAULT_COLORS.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});
