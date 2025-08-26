import { SlidersIcon } from "@/src/assets/icons";
import { useLocation } from "@/src/hooks/useLocation";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, TextInput, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button } from "../button/button";
import { ErrorMessage } from "../error-message/error-message";
import { Label } from "../label/label";
import { RadioOptions } from "../multiple-options/multiple-options";
import { DefaultTextInput } from "../text-input/text-input";
import { ISearchSchema, searchSchema } from "./search-bar.schema";
import { styles } from "./search-bar.styles";

const colors = DEFAULT_COLORS;

export const SearchBar = () => {
  const { location } = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const hookForm = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
      location: location?.city || "",
      level: [],
      playerQty: 1,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = hookForm;

  const onSubmit = (data: ISearchSchema) => {
    console.log("Search data:", data);

    setIsOpen(false);
  };

  const searchValue = hookForm.watch("search");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      overflow: isOpen ? "visible" : "hidden",
      height: "auto",
    };
  }, [isOpen]);

  useEffect(() => {
    if (!location) return;

    const locationString = `${location?.district || ""}${
      location?.district && location?.city ? ", " : ""
    }${location?.city || ""}`;

    hookForm.setValue("location", locationString || "");
  }, [location]);

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <View style={styles.topFilter}>
        <View style={styles.search}>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <MaterialIcons
              name="search"
              size={24}
              color={searchValue ? colors.white : "rgba(255,255,255,0.3)"}
            />
          </Pressable>

          <Controller
            control={control}
            name="search"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.searchInput}
                placeholder={"Pesquisar"}
                value={value}
                onChangeText={onChange}
                placeholderTextColor={"rgba(255,255,255,0.3)"}
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />
        </View>

        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={({ pressed }) => [
            styles.filterButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <SlidersIcon size={20} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.bottomFilter}>
        <View style={styles.fieldset}>
          <Label text="Localização" />
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <DefaultTextInput
                hasError={!!errors?.location?.message}
                placeholder={"Digite a localização"}
                value={value}
                onChangeText={onChange}
                type="location"
              />
            )}
          />
          {errors?.location?.message && (
            <ErrorMessage text={errors?.location?.message} />
          )}
        </View>

        <View style={styles.fieldset}>
          <Label text="Nível de Dificuldade" />

          <RadioOptions
            hookform={hookForm}
            name="level"
            hasError={!!errors?.level?.message}
            options={[
              { value: "easy", name: "Iniciante" },
              { value: "medium", name: "Intermediário" },
              { value: "hard", name: "Veterano" },
              { value: "professional", name: "Profissional" },
            ]}
          />

          {errors?.level?.message && (
            <ErrorMessage text={errors?.level?.message} />
          )}
        </View>

        <View style={styles.fieldset}>
          <Label text="Quantidade de Jogadores" />

          <Controller
            control={control}
            name="playerQty"
            render={({ field: { onChange, value } }) => (
              <DefaultTextInput
                hasError={!!errors?.playerQty?.message}
                placeholder={"Número de jogadores"}
                value={value?.toString()}
                onChangeText={onChange}
              />
            )}
          />
          {errors?.playerQty?.message && (
            <ErrorMessage text={errors?.playerQty?.message} />
          )}
        </View>

        <Button text="Pesquisar" onPress={handleSubmit(onSubmit)} />
      </View>
    </Animated.View>
  );
};
