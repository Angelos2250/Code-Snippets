import {
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Icon,
  Spacer,
  VStack,
  useStyleConfig,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

import CountTable from "components/Table/CountTable";
import Card from "components/OrnithologistCard/OrnithologistCard";

import { FiSearch } from "react-icons/fi";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where, limit, orderBy } from "firebase/firestore";
import { db } from "auth/Auth";
import { ZählteamsColumns } from "Interfaces/collections";

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

function Ornithologists(props: {
   handleSortingChange: any;
}) {
  const ornithologists = collection(db, "Zählteams").withConverter(
    postConverter
  );
  const [sortingAttribute, setSortingAttribute] = useState("id"); 
  const [orderAttribute, setOrderAttribute]:any = useState("asc"); 

  const handleSortingChange = (column:string,attribute:any,order:string) => {
   let attr = column;
   if (attribute != undefined) {
      attr += ".";
      attr += attribute;
   }
   setSortingAttribute(attr);
   setOrderAttribute(order);
   console.log(order);
   console.log(attr);
  };

  
  const noFilter = "";
  const [filter, changeFilter] = useState(noFilter);
  const handleInput = (event: any) => changeFilter(event.target.value);
  
  const TableQuery = query(
     ornithologists,
     orderBy(sortingAttribute,orderAttribute),
     limit(10)
     );

     const [activeQuery, setActiveQuery] = useState(TableQuery);

     useEffect(() => {
      setActiveQuery(TableQuery);
     }, [sortingAttribute]);
     useEffect(() => {
      setActiveQuery(TableQuery);
     }, [orderAttribute]);
  const [TableData] = useCollectionData(activeQuery);

  const CardQuery = query(
    ornithologists,
    where("Zählteam", ">=", filter),
    where("Zählteam", "<=", filter + "~"),
    limit(7)
  );

  const [CardData] = useCollectionData(CardQuery);

  const cardContainerStyle = useStyleConfig("ScrollContainer");

  return (
    <Box
      bg="gray.100"
      h="100%"
      minHeight="100vh"
      alignItems="top"
      padding="24px"
    >
      <VStack align="stretch" spacing="50px">
        <Flex>
          <Heading>Zähler</Heading>
          <Spacer />
          <InputGroup color="gray.800" width="250px" onChange={handleInput}>
            <InputLeftElement pointerEvents="none">
              <Icon
                fontSize="16"
                _groupHover={{ color: "gray" }}
                as={FiSearch}
              />
            </InputLeftElement>
            <Input type="text" placeholder="Suche" bg={"white"} />
          </InputGroup>
        </Flex>
        <Box minHeight="700px" __css={cardContainerStyle}>
          <Flex paddingTop="60px">
            <Box minWidth="60px" />
            {CardData?.map((person: any) => (
              <>
                <Card variant={"rounded"} person={person} />
                <Box minWidth="60px" />
              </>
            ))}
          </Flex>
        </Box>

        <VStack paddingTop="60px" paddingBottom="100px" align="left">
          <Heading size="lg">Alle Zähler</Heading>
          <CountTable
            activeTableData={TableData}
            activeTableName={"Zählteams"}
            activeTableColumns={ZählteamsColumns}
            handleSortingChange={handleSortingChange}
          />
        </VStack>
      </VStack>
    </Box>
  );
}

export default Ornithologists;
