import styled from "@emotion/styled";
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 10px;
  overflow-x: auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
export const TableContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

export const TableHeader = styled.th`
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4a5568;
  color: white;
`;

export const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;
export const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1A202C;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 50rem;
  padding: 2.5rem;
  margin: 2rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 #1A202C, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background-color: #F7FAFC;
  height: 80vh;
`;

export const AccountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 #1A202C, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background-color: #EDF2F7;
`;
export const ProofContainer = styled.div`
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: #EDF2F7;
  overflow: auto;
  max-height: 650px;
  overflow-wrap: anywhere;
`;

export const Button = styled.button`
  display: block;
  width: auto;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  color: #F7FAFC;
  background-color: #00ffff;
  cursor: pointer;

  &:hover {
    background-color: #0000ff;
  }

  &:disabled {
    background-color: #d2d9df;
    cursor: not-allowed;
    color: #F7FAFC;
  }
`;

export const IconButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  color: #F7FAFC;
  background-color: #E53E3E;
  cursor: pointer;

  &:hover {
    background-color: #a86c53;
  }
`;

export const IconText = styled.span`
  margin-left: 0.1rem; // Adjust as needed
`;



