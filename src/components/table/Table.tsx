import { useState } from "react";
import { ColType, ModalProps, ModalState } from "../../types";
import numeral from "numeral";

type TableHeader = {
  label: string;
  type: ColType;
  prefix: string;
  suffix: string;
};

type Props = {
  headers: TableHeader[];
  data: string[][];
  alignRightLastCol: boolean;
  colClasses: string[];
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  defaultColSort?: number;
};

function Table(props: Props) {
  const { headers, data, alignRightLastCol, colClasses, setModal, defaultColSort } = props;

  const [sort, setSort] = useState<number>(defaultColSort ? defaultColSort : 1);
  const [dateFilterBack, setDateFilterBack] = useState<number>(0); //0 filter off,
  //negative = numbers second to subtract from current epoch time to the back end of range
  const [dateFilterFront, setDateFilterFront] = useState<number>(0); //0 unless a date is input into DD-MM-YYYY second bit
  //negative = " to front end of range

  function dataReturn(colType: ColType, prefix: string, d: string, suffix: string) {
    switch (colType) {
      case ColType.String:
        return [prefix, d, suffix];
      case ColType.Number:
        return [prefix, d !== "0" ? numeral(Number(d)).format("0,0.[0000]") : "-", suffix];
      case ColType.Date:
        return Number(d)
          ? [
              prefix,
              new Date(Number(d)).toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) +
                " " +
                new Date(Number(d)).toLocaleTimeString("en-GB", { hourCycle: "h23" }),
              suffix,
            ]
          : "-";
      case ColType.Actions:
        return (
          <div className="buttons">
            <button
              onClick={() => {
                setModal({ state: ModalState.TokenizeYield });
              }}
            >
              Tokenize Yield
            </button>
            <button
              onClick={() => {
                setModal({ state: ModalState.RedeemYield });
              }}
            >
              Redeem Yield
            </button>
            <button
              onClick={() => {
                setModal({ state: ModalState.RedeemFromPT });
              }}
            >
              Redeem PT
            </button>
            <button
              onClick={() => {
                setModal({ state: ModalState.ClaimYield });
              }}
            >
              Claim Yield
            </button>
          </div>
        );
      default:
        break;
    }
  }

  return [
    headers.map((h: TableHeader) => h.type).includes(ColType.Date) && (
      <div className="flex-row date-filter gap-eight card-padding tb-margin" key="time-filters">
        <div
          className={"date-filter-tab" + (dateFilterBack === 0 ? " active" : "")}
          onClick={() => {
            setDateFilterBack(0);
            setDateFilterFront(0);
          }}
        >
          All
        </div>
        <div
          className={"date-filter-tab" + (dateFilterBack === -86400 ? " active" : "")}
          onClick={() => {
            setDateFilterBack(-86400);
            setDateFilterFront(0);
          }}
        >
          Yesterday
        </div>
        <div
          className={"date-filter-tab" + (dateFilterBack === -604800 ? " active" : "")}
          onClick={() => {
            setDateFilterBack(-604800);
            setDateFilterFront(0);
          }}
        >
          7 Days
        </div>
        <div
          className={"date-filter-tab" + (dateFilterBack === -2592000 ? " active" : "")}
          onClick={() => {
            setDateFilterBack(-2592000);
            setDateFilterFront(0);
          }}
        >
          30 Days
        </div>
        <input
          className={
            "date-filter-tab back" +
            (dateFilterBack < 0 &&
            dateFilterBack !== -2592000 &&
            dateFilterBack !== -604800 &&
            dateFilterBack !== -86400
              ? " active"
              : "")
          }
          type="date"
          onChange={(e) => {
            setDateFilterBack((0 - new Date().valueOf() + new Date(e.target.value).valueOf()) / 1000);
          }}
        />
        <input
          className={"date-filter-tab front" + (dateFilterFront > 0 ? " active" : "")}
          type="date"
          onChange={(e) => {
            setDateFilterFront((0 - new Date().valueOf() + new Date(e.target.value).valueOf()) / 1000);
          }}
        />
      </div>
    ),
    <div className="sort-headers" key="headers">
      {headers.map((h: TableHeader, i: number) => (
        <div
          className={
            "sort-header " + colClasses[i] + " " + (i + 1 === headers.length && alignRightLastCol ? " align-right" : "")
          }
          onClick={() => {
            setSort(sort !== i + 1 && sort !== (i + 1) * -1 ? i + 1 : sort * -1);
          }}
          key={"header" + i}
        >
          {h.label}
          <div className="sort">
            <div className={(sort === i + 1 ? "active " : " ") + "asc"}>&#x25B2;</div>
            <div className={(sort === (i + 1) * -1 ? "active " : " ") + "desc"}>&#9660;</div>
          </div>
        </div>
      ))}
    </div>,
    <div className="rows" key="rows">
      {data
        .sort((a: string[], b: string[]) => {
          if (sort > 0) {
            if (headers[sort - 1].type === ColType.String) {
              return a[sort - 1].localeCompare(b[sort - 1]);
            } else if (headers[sort - 1].type === ColType.Number || headers[sort - 1].type === ColType.Date) {
              //using elseif in case more types later
              return Number(a[sort - 1]) < Number(b[sort - 1]) ? -1 : Number(a[sort - 1]) > Number(b[sort - 1]) ? 1 : 0;
            }
          } else {
            const deneg = sort * -1;
            if (headers[deneg - 1].type === ColType.String) {
              return b[deneg - 1].localeCompare(a[deneg - 1]);
            } else if (headers[deneg - 1].type === ColType.Number || headers[deneg - 1].type === ColType.Date) {
              return Number(b[deneg - 1]) < Number(a[deneg - 1])
                ? -1
                : Number(b[deneg - 1]) > Number(a[deneg - 1])
                ? 1
                : 0;
            }
          }
          return sort;
        })
        //date filter
        .filter((d: string[]) => {
          if (headers.map((h: TableHeader) => h.type).includes(ColType.Date) && dateFilterBack < 0) {
            const dateColIdx =
              //if selected header is a date, filter will be for that column
              headers[sort - 1].type === ColType.Date
                ? sort - 1
                : headers.findIndex((h: TableHeader) => h.type === ColType.Date);
            if (new Date().valueOf() / 1000 + dateFilterBack > Number(d[dateColIdx])) {
              return false;
            } else if (dateFilterFront < 0 && new Date().valueOf() / 1000 + dateFilterFront < Number(d[dateColIdx])) {
              return false;
            } else return true;
          } else return true;
        })
        .map((r: string[], i: number) => (
          <div className="row" key={i}>
            {r.map((d: string, j: number) => (
              <div
                key={j}
                className={
                  "row-col " +
                  colClasses[j] +
                  " " +
                  (r.length === j + 1 && alignRightLastCol ? " align-right" : "") +
                  (r[j] === "BUY" || r[j] === "FILLED" || (headers[j].label === "PNL" && Number(r[j]) > 0)
                    ? " green"
                    : "") +
                  (r[j] === "SELL" ||
                  r[j] === "REJECT" ||
                  r[j] === "USER_CANCEL" ||
                  (headers[j].type === ColType.Number && Number(r[j]) < 0)
                    ? " red"
                    : "")
                }
              >
                {dataReturn(headers[j].type, headers[j].prefix, d, headers[j].suffix)}
              </div>
            ))}
          </div>
        ))}
    </div>,
  ];
}

export default Table;
