import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { AiOutlineSearch } from "react-icons/ai";

type SearchInputProps = {
  user?: User | null;
};

const SearchInput = ({ user }: SearchInputProps) => {
  return (
    <Flex flexGrow={1} mr={2} maxW={user ? "auto" : "600px"} align={"center"}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<AiOutlineSearch className="text-gray-400 mb-1" />}
        />

        <Input
          placeholder="Search Reddit"
          fontSize="10pt"
          _placeholder={{
            color: "gray.500",
          }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            border: "1px solid ",
            borderColor: "blue.500",
          }}
          height="34px"
          bg="gray.100"
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;

// hello there how are you i hope you are fine and you know what i am the god of the uchia
