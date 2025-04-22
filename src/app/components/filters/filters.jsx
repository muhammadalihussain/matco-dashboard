"use client";
import { useEffect, useState, useRef, useContext } from "react";
import styles from "./filters.module.css";
import { UserContext } from "../../lib/context/userProvider";
// import {useStore} from "../../lib/stores"
// import CustomDatePicker from "../../components/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { authService } from "../../lib/services/authService"; //"../../../lib/services/authService";

import clsx from "clsx";
const Filters = () => {
  const [startdate, setStartDate] = useState(
    // dayjs("12-12-2022").startOf("month")
    dayjs().startOf("month")
  );
  const [enddate, setEndDate] = useState(dayjs().endOf("month"));

  const [DataAreaId, setDataAreaId] = useState(0);
  const [DataAreaIdrecords, setDataAreaIdRecords] = useState([]);
  // const setData = useStore((state) => state.setData);
  const [SiteId, setSiteId] = useState(0);
  const [SiteRecords, setSiteRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingSite, setLoadingSite] = useState(true);
  const hasFetched = useRef(false); // Prevents duplicate API calls

  const { setDataSites } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) return; // Skip if already fetched
      hasFetched.current = true;
      try {
        await authService.getsitesbyuserid().then((u) => {
          setDataAreaId(u[0].Id);

          setDataAreaIdRecords(u);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching areaid data:", error);
      } finally {
      }
    };

    if (loading) fetchData();
  }, [loading]);

  useEffect(() => {
    const fetchDataSite = async () => {
      try {
        setSiteId(0);

        if (DataAreaId != 0) {
          setDataSites((prev) => ({
            ...prev,
            site: 0,
            dataAreaId: DataAreaId,
          }));
          setSiteRecords([]);
          await authService.getSites(DataAreaId).then((u) => {
            setSiteRecords(u);
            setLoadingSite(false);
          });
        }
      } catch (error) {
        console.error("Error fetching site data:", error);
      } finally {
      }
    };

    fetchDataSite();
  }, [DataAreaId]);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.main}>
          <div className={styles.search}>
            <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
              <legend className="px-2 text-sm font-medium text-green-500">
                Dates
              </legend>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date "
                  value={startdate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                  slotProps={{
                    textField: {
                      InputLabelProps: { style: { color: "#b7bac1" } }, // Change label color
                    },
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={enddate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                  slotProps={{
                    textField: {
                      InputLabelProps: { style: { color: "#b7bac1" } }, // Change label color
                    },
                  }}
                />
              </LocalizationProvider>
            </fieldset>
            {/* <select
          name="dataareaId"
          id="dataareaId"
          value={DataAreaId}
          onChange={(e) => setDataAreaId(e.target.value)}
        >
          <option value="0" disabled>
            Choose a site
          </option>
          {DataAreaIdrecords?.length > 0 ? (
            DataAreaIdrecords.map((id) => (
              <option key={id.Id} value={id.Id}>
                {id.Id}
              </option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select> */}

            <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
              <legend className="px-2 text-sm font-medium text-green-500">
                Company
              </legend>
              <div className="flex  gap-2 ">
                {DataAreaIdrecords?.length > 0
                  ? DataAreaIdrecords.map((id) => (
                      <button
                        style={{
                          pointerEvents:
                            id?.IsActive === false ? "none" : "auto",
                          cursor:
                            id?.IsActive === false ? "not-allowed" : "pointer",
                          opacity: id?.IsActive === false ? 0.5 : 1,
                        }}
                        key={id.Id}
                        onClick={
                          id?.IsActive === false
                            ? undefined
                            : () => {
                                setDataAreaId(id.Id);
                              }
                        }
                        className={clsx(
                          `px-4 py-2 rounded-lg ${
                            id.IsActive === false
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`,
                          DataAreaId === id.Id
                            ? "bg-red-600"
                            : "bg-teal-700 hover:bg-blue-500"
                        )}
                      >
                        {id.Id}
                      </button>
                    ))
                  : "waiting..."}
              </div>
            </fieldset>
          </div>
          <div className={styles.site}>
            <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
              <legend className="px-2 text-sm font-medium text-green-500">
                Company Sites
              </legend>
              {/* Buttons */}
              <div className="flex justify-center items-center  gap-4 ">
                {SiteRecords?.length > 0 ? (
                  <button
                    key={0}
                    onClick={() => {
                      setSiteId(0);
                      setDataSites((prev) => ({
                        ...prev,
                        site: 0,
                        dataAreaId: DataAreaId,
                      }));
                    }}
                    className={clsx(
                      "px-4 py-2 rounded-lg transition-all ",
                      SiteId === 0
                        ? "bg-red-600"
                        : "bg-teal-700 hover:bg-blue-500"
                    )}
                  >
                    All
                  </button>
                ) : (
                  ""
                )}

                {SiteRecords?.length > 0
                  ? SiteRecords.map((id) => (
                      <button
                        key={id.Id}
                        onClick={() => {
                          setSiteId(id.Id);
                          setDataSites((prev) => ({
                            ...prev,
                            site: id.Id,
                            dataAreaId: DataAreaId,
                          }));
                        }}
                        className={clsx(
                          "px-4 py-2 rounded-lg ",
                          SiteId === id.Id
                            ? "bg-red-600"
                            : "bg-teal-700 hover:bg-blue-500"
                        )}
                      >
                        {id.Id}
                      </button>
                    ))
                  : "waiting...."}
              </div>
            </fieldset>

            <div>
              <fieldset
                className={`border border-gray-700 rounded-lg p-4 ml-[50px] `}
              >
                <legend className="px-2 text-sm font-medium text-green-500">
                  Search
                </legend>
                <button
                  className="bg-teal-700 py-2 w-[133px] "
                  type="submit"
                  onClick={() => {
                    setDataSites((prev) => ({
                      ...prev,
                      start: startdate,
                      end: enddate,
                    }));
                  }}
                >
                  Search
                </button>
              </fieldset>
            </div>
          </div>
        </div>

        {/* <select
          name="SiteId"
          id="SiteId"
          value={SiteId}
          onChange={(e) => setSiteId(e.target.value)}
        >
          <option value="0" disabled>
            Choose a site
          </option>
          {SiteRecords?.length > 0 ? (
            SiteRecords.map((id) => (
              <option key={id.Id} value={id.Id}>
                {id.Id}
              </option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select> */}

        {/* <button className="bg-teal-500" type="submit">
          Search
        </button> */}
      </div>
    </div>
  );
};

export default Filters;

/*
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date "
            value={startdate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{
              textField: {
                InputLabelProps: { style: { color: "#b7bac1" } }, // Change label color
              },
            }}
          />
          <DatePicker
            label="End Date"
            value={enddate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{
              textField: {
                InputLabelProps: { style: { color: "#b7bac1" } }, // Change label color
              },
            }}
          />
        </LocalizationProvider>
        */
