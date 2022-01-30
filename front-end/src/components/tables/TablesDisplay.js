import { useHistory } from "react-router";
import { freeTable } from "../../utils/api";
import { today } from "../../utils/date-time";

export default function TablesDisplay({ tables, loadDashboard }) {
  const history = useHistory();
  async function _clickHandler({ target }) {
    if (
      !window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    )
      return null;
    const abortController = new AbortController();
    await freeTable(target.value, abortController.signal)
    await loadDashboard()
      history.push(`/dashboard?date=${today()}`);
    return () => abortController.abort();
  }

  const tableList =
    !tables || tables.length === 0 ? (
      <div className="d-md-flex mb-3 justify-content-center">
        <h4>There are no tables</h4>
      </div>
    ) : (
      <ul className="list-group">
        {tables.map((table, index) => {
          console.log(table)
          return (
            <li className="list-group-item lgi-table" key={table.table_id}>
              <h5 className="lgi-table-interior">
                {table.table_name}: seats up to {table.capacity}
              </h5>
              {table.reservation_id ? (
                <div className="lgi-table-interior">
                  <p
                    className="lgi-table-interior"
                    data-table-id-status={table.table_id}
                  >
                    occupied
                  </p>
                  <button
                    type="button"
                    name="finish"
                    id="finish"
                    className="btn btn-a border-a"
                    value={table.table_id}
                    data-reservation-date={table.reservation_date}
                    data-table-id-finish={table.table_id}
                    onClick={_clickHandler}
                  >
                  Finish
                  </button>
                </div>
              ) : (
                <p
                  className="lgi-table-interior"
                  data-table-id-status={table.table_id}
                >
                  Free
                </p>
              )}
            </li>
          );
        })}
      </ul>
    );

  return <div>{tableList}</div>;
}