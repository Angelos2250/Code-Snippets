import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  IconButton,
  useStyleConfig,
} from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { columnType } from "Interfaces/collections";

function isEmpty(value: any) {
  return typeof value === "undefined" || value == null;
}
function CountTable(props: {
   activeTableData: any;
   activeTableName: string;
   activeTableColumns: columnType[];
   handleSortingChange: any;
}) {
  // activeTableName parameter for Edit Document

  const handleClick = (s:string,s2:any,s3:string) => {
   console.log("clicked", s2);
   props.handleSortingChange(s,s2,s3);
  }
  const ScrollContainerStyle = useStyleConfig("ScrollContainer");

  return (
    <Box w="100%" borderRadius="12" __css={ScrollContainerStyle}>
      <Table
        variant="striped"
        bg="white"
        colorScheme="gray"
        borderRadius="12"
        size="md"
      >
        <Thead>
          <Tr>
            {props.activeTableColumns?.map((col: columnType, index: number) => {
              return <Th className={"up"} key={index} >{col.name}  <button onClick={() => handleClick(col.data,col.att,"asc")}>▲</button>
              <button onClick={() => handleClick(col.data,col.att,"desc")}>▼</button></Th>;
            })}
            <Th />
          </Tr>
        </Thead>
        <Tbody color={"gray"}>
          {props.activeTableData?.map((bird: any) => (
            <Tr key={bird.id}>
              {props.activeTableColumns?.map(
                (col: columnType, index: number) => {
                  if (
                    isEmpty(bird.data[col.data]) ||
                    (!isEmpty(col.att) &&
                      col.att != null &&
                      isEmpty(bird.data[col.data][col.att]))
                  ) {
                    // if attribute doesn't exist
                    // return empty content
                    return <Td key={index}></Td>;
                  }
                  if (col.att != null) {
                    // attribute inside object
                    return <Td key={index}>{bird.data[col.data][col.att]}</Td>;
                  } else {
                    return <Td key={index}>{bird.data[col.data]}</Td>;
                  }
                }
              )}

              <Td isNumeric>
                <IconButton
                  variant="ghost"
                  aria-label=""
                  colorScheme="grey"
                  icon={<BiEditAlt size={25} />}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default CountTable;

