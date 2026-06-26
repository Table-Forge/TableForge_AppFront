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
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";
import { Label } from "@/src/components/label/label";

interface ITimeInputProps {
  label: string;
  value?: string | Date;
  onChange: (time: string) => void;
  error?: string;
  placeholder?: string;
  infoText?: string;
}

export const TimeInput = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  infoText,
}: ITimeInputProps) => {
  const [show, setShow] = useState(false);
  const timeValue = value ? new Date(value) : new Date();

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (selectedTime) {
      onChange(selectedTime.toISOString());
    }
  };

  const formatTime = (dateStr?: string | Date) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={{ width: "100%" }}>
      <Label text={label} infoText={infoText} />
      <TouchableOpacity activeOpacity={0.7} onPress={() => setShow(true)}>
        <View pointerEvents="none">
          <Input
            placeholder={placeholder || "--:--"}
            value={formatTime(value)}
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
                    value={timeValue}
                    mode="time"
                    display="spinner"
                    is24Hour={true}
                    onChange={handleTimeChange}
                    textColor={DEFAULT_COLORS.white}
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
          value={timeValue}
          mode="time"
          display="default"
          is24Hour={true}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: SURFACES.overlayStrong,
  },
  modalContainer: {
    backgroundColor: SURFACES.card,
    padding: 22,
    borderTopLeftRadius: RADII.xxl,
    borderTopRightRadius: RADII.xxl,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: BORDERS.highlight,
    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
