import { FormControl, OutlinedInput } from "@material-ui/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/dist/client/router";

type TInputs = { [key: string]: string };

const SearchInput = () => {
  const router = useRouter();
  const { handleSubmit, control } = useForm<TInputs>();

  const onSearch = (data: { term: string }) => {
    router.push(`/review?q=${data.term}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      style={{ display: "flex", flex: 1, width: "100%" }}
    >
      <Controller
        control={control}
        render={({ field: { value, name, ...props } }) => (
          <FormControl fullWidth={true} variant="outlined" margin="dense">
            <OutlinedInput
              style={{ backgroundColor: "#fff" }}
              size="small"
              id={name}
              inputProps={{
                "data-testid": `input-${name}`,
              }}
              fullWidth
              value={value}
              placeholder="Buscar produtos"
              endAdornment={
                <IconButton type="submit" data-testid="button-search-submit">
                  <SearchIcon />
                </IconButton>
              }
              {...props}
            />
          </FormControl>
        )}
        name="term"
        defaultValue=""
      />
    </form>
  );
};

export default SearchInput;
