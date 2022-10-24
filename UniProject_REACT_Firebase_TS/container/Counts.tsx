import {
  Flex,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  VStack,
  InputGroup,
  InputLeftElement,
  Icon,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { Tables } from "Interfaces/collections";

import CountTable from "components/Table/CountTable";

import { FiSearch } from "react-icons/fi";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, limit } from "firebase/firestore";
import { db } from "auth/Auth";

const postConverter = {
  toFirestore(post: any) {
    return { author: post.author, title: post.title };
  },
  fromFirestore(snapshot: any, options: any) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ref: snapshot.ref,
      data: data,
    };
  },
};

const defaultTableIndex = 0;
const defaultRowCount = 5;

function Counts() {
  const [activeTableIndex, setActiveTable] = useState(defaultTableIndex);
  const [rows, setRows] = useState(defaultRowCount);
  const handleRowChange = (rows: any) => setRows(rows);
  const TableName = Tables[activeTableIndex].Table;
  const Columns = Tables[activeTableIndex].TableColumns;

  const count = collection(db, TableName).withConverter(postConverter);

  // =========== find attribute name for date for each table ==========
  // let ColDate = null;
  // Columns.map((col: columnType, index: number) => {
  //     if(col.name == 'Datum'){
  //         ColDate = col.data;
  //         return;
  //     }
  // });
  // console.log(ColDate);

  const countQuery = query(count, limit(rows));
  const [TableData] = useCollectionData(countQuery);

  return (
    <Flex
      bg="gray.100"
      h="100%"
      minHeight="100vh"
      alignItems="start"
      paddingLeft="150px"
      paddingRight="150px"
      paddingTop="48px"
      paddingBottom="24px"
    >
      <VStack align="start" spacing="24px" width="100%">
        <Heading size="2xl">{Tables[activeTableIndex].Title}</Heading>
        <Text>{Tables[activeTableIndex].Desc}</Text>
        <HStack
          align="stretch"
          shouldWrapChildren={true}
          justify="space-between"
          width="100%"
        >
          <NumberInput
            step={1}
            value={rows}
            min={1}
            max={40}
            backgroundColor="white"
            onChange={handleRowChange}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <InputGroup color="gray.800">
            <InputLeftElement pointerEvents="none">
              <Icon
                fontSize="16"
                _groupHover={{ color: "gray" }}
                as={FiSearch}
              />
            </InputLeftElement>
            <Input type="text" placeholder="Suche" bg={"white"} />
          </InputGroup>
          <Select
            backgroundColor="white"
            borderColor="white"
            color="black"
            focusBorderColor="green"
            id="TableFilter"
            value={activeTableIndex}
            onChange={(event) => setActiveTable(Number(event.target.value))}
          >
            {Tables.map((table, index) => {
              return (
                <option key={index} value={index}>
                  {table.Title}
                </option>
              );
            })}
          </Select>
        </HStack>
        <CountTable
          activeTableData={TableData}
          activeTableName={TableName}
          activeTableColumns={Columns}
        />
      </VStack>
    </Flex>
  );
}

export default Counts;
