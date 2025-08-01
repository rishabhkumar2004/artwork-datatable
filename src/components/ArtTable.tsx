import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { Artwork } from "./Types";

const ArtTable = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState<{ [id: number]: Artwork }>(
    {}
  );

  const fetchData = async (pageNumber = 1) => {
    try {
      const res = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=10`
      );
      const json = await res.json();
      setArtworks(json.data);
      setTotalRecords(json.pagination.total);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => {
    fetchData(page + 1); 
  }, [page]);

  
  const onSelectionChange = (e: { value: Artwork[] }) => {
    const newSelection: Artwork[] = e.value;
    const updated: { [id: number]: Artwork } = { ...selectedRows };

    artworks.forEach((art) => {
      const isSelected = newSelection.some((a) => a.id === art.id);
      if (isSelected) {
        updated[art.id] = art;
      } else {
        delete updated[art.id];
      }
    });

    setSelectedRows(updated);
  };

  const currentPageSelection = artworks.filter((art) => selectedRows[art.id]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Art Institute of Chicago</h2>

      <DataTable
        value={artworks}
        paginator
        rows={10}
        lazy
        totalRecords={totalRecords}
        first={page * 10}
        onPage={(e) => setPage(e.page ?? 0)}
        dataKey="id"
        selection={currentPageSelection}
        onSelectionChange={onSelectionChange}
        selectionMode="multiple" // ✅ This is the required prop
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3em" }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Year" />
        <Column field="date_end" header="End Year" />
      </DataTable>

      <div style={{ marginTop: "2rem" }}>
        <h3>Selected Artworks (Persisted Across Pages)</h3>
        <ul>
          {Object.values(selectedRows).map((art) => (
            <li key={art.id}>{art.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArtTable;
