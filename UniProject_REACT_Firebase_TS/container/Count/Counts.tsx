import { useState, useEffect } from "react";
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
  Button,
  Center,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { FiSearch, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  collection,
  query,
  limit,
  where,
  orderBy,
  startAfter,
  endBefore,
  limitToLast,
  getDoc,
  getDocs,
  QuerySnapshot,
  DocumentReference,
  DocumentData,
  documentId,
} from "firebase/firestore";
import { db } from "auth/Auth";
import { Tables } from "Interfaces/collections";
import CountTable from "components/Table/CountTable";
import { useToast } from "@chakra-ui/react";
import { prototype } from "events";

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

interface ITableData {
  id: string;
  ref: DocumentReference;
  data: DocumentData;
}
let fetchFirstAndLast = false;
let lastDocId: any;
let firstDoc: any;
let firstDocId: any;

let lastVisible: any;
let lastVisibleId: any;
let firstVisible: any;
let firstVisibleId: any;

function Counts() {
  const toast = useToast();
  const [activeTableIndex, setActiveTable] = useState(defaultTableIndex);
  const [rows, setRows] = useState(defaultRowCount);
  const TableName = Tables[activeTableIndex].Table;
  const Columns = Tables[activeTableIndex].TableColumns;
  const count = collection(db, TableName).withConverter(postConverter);
  const [sortingAttribute, setSortingAttribute] = useState("id"); 
  const [orderAttribute, setOrderAttribute]:any = useState("asc"); 

  //main Queries
  const startQuery = query(count, orderBy(sortingAttribute, orderAttribute), limit(rows));
  const lastDocQuery = query(count, orderBy(sortingAttribute, "desc"), limit(1));
  const firstDocQuery = query(count, orderBy(sortingAttribute, "asc"), limit(1));

  // Change row count limit
  const handleRowChange = (rows: any) => setRows(rows);

  //Query as State
  const [activeQuery, setActiveQuery] = useState(startQuery);

  const getFirstAndLastDoc = async () => {
    const documentSnapshotsFirst = await getDocs(firstDocQuery);
    const documentSnapshotsLast = await getDocs(lastDocQuery);
    documentSnapshotsFirst.forEach((doc) => {
      firstDocId = doc.id;
    });
    documentSnapshotsLast.forEach((doc) => {
      lastDocId = doc.id;
    });
    firstDoc = documentSnapshotsFirst.docs[0];
    console.log(firstDocId,", ",lastDocId);
    if (orderAttribute == "desc") {
      const temp = firstDocId;
      firstDocId = lastDocId;
      lastDocId = temp;
    }
  };

  const getDocSnapShot = async () => {
    const documentSnapshots = await getDocs(activeQuery);
    firstVisibleId = documentSnapshots.docs[0].id;
    lastVisibleId = documentSnapshots.docs[documentSnapshots.docs.length - 1].id;
    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    firstVisible = documentSnapshots.docs[0];
    return documentSnapshots;
  };

  if (!fetchFirstAndLast) {
    getFirstAndLastDoc();
    fetchFirstAndLast = true;
  }

  const [docSnap, setDocSnap] = useState(getDocSnapShot());
  // Search Filter
  const [filter, changeFilter] = useState("");
  const handleInput = (event: any) => changeFilter(event.target.value);

  const [TableData, loading, error, snapshot] = useCollectionData(activeQuery);

  //return TableData
  const getTableData = () => {
    return TableData;
  };

  // Force Refresh Table after Tablechange and Rowchange
  useEffect(() => {
    setActiveQuery(startQuery);
    fetchFirstAndLast = false;
  }, [activeTableIndex]);
  useEffect(() => {
    setActiveQuery(startQuery);
    //fetchFirstAndLast = false;
  }, [rows]);
  useEffect(() => {
   setActiveQuery(startQuery);
   fetchFirstAndLast = false;
  }, [sortingAttribute]);
  useEffect(() => {
   setActiveQuery(startQuery);
   fetchFirstAndLast = false;
  }, [orderAttribute]);
  
  const handleSearch = (event: any) => {
    if (filter == "") {
      setActiveQuery(startQuery);
    } else {
      const filterQuery = query(
        count,
        where("namen.dtName", ">=", filter),
        where("namen.dtName", "<=", filter + "~"),
        orderBy("namen.dtName"),
        limit(rows)
      );
      setActiveQuery(filterQuery);
    }
  };

  const handleSortingChange = (column:string,attribute:any,order:string) => {
   let attr = column;
   if (attribute != undefined) {
      attr += ".";
      attr += attribute;
   }
   setSortingAttribute(attr);
   setOrderAttribute(order);
   console.log(order);
  };

  //Handle Forward Pagination
  const handleForwardClick = () => {
    if (lastVisibleId == lastDocId) {
      toast({
        id: "first-page-warning",
        title: "Letzte Seite erreicht.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    } else {
      const forwardQuery = query(
        startQuery,
        startAfter(lastVisible),
        limit(rows)
      );
      setActiveQuery(forwardQuery);
    }
  };

  //Handle Previous Pagination
  const handleBackClick = () => {
    if (firstVisibleId == firstDocId) {
      toast({
        id: "last-page-warning",
        title: "Erste Seite erreicht.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    } else {
      const backQuery = query(
        startQuery,
        endBefore(firstVisible),
        limitToLast(rows)
      );
      setActiveQuery(backQuery);
    }
  };

  const handleTableChange = (event: any) => {
    setActiveQuery(startQuery);
    setActiveTable(Number(event.target.value));
  };

  return (
    <Flex bg="gray.100" h="100%" alignItems="start" padding="24px">
      <VStack align="start" spacing="24px" width="100%">
        <Heading>{Tables[activeTableIndex].Title}</Heading>
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
          <IconButton
            aria-label="back"
            icon={<FiArrowLeft />}
            size={"md"}
            onClick={handleBackClick}
          />
          <IconButton
            aria-label="forward"
            icon={<FiArrowRight />}
            size={"md"}
            onClick={handleForwardClick}
          />
          <InputGroup color="gray.800" onChange={handleInput}>
            <InputLeftElement pointerEvents="none">
              <Icon
                fontSize="16"
                _groupHover={{ color: "gray" }}
                as={FiSearch}
              />
            </InputLeftElement>
            <Input type="text" placeholder="Suche" bg={"white"} />
          </InputGroup>
          <div>
            <Button onClick={handleSearch}>
              <Icon fontSize="16" size={"md"} as={FiSearch} />
            </Button>
          </div>
          <Select
            backgroundColor="white"
            borderColor="white"
            color="black"
            focusBorderColor="green"
            id="TableFilter"
            value={activeTableIndex}
            onChange={handleTableChange}
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
        {loading ? (
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="green.400"
              size="xl"
            />
          </Center>
        ) : (
          <CountTable
            activeTableData={getTableData()}
            activeTableName={TableName}
            activeTableColumns={Columns}
            handleSortingChange={handleSortingChange}
          />
        )}
      </VStack>
    </Flex>
  );
}

export default Counts;
