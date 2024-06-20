import axios from "axios";

export const getSingaporeAddress = async (searchTerm) => {
  const apiUrl = `https://www.onemap.gov.sg/api/common/elastic/search`;
  try {
    const response = await axios.get(apiUrl, {
      params: {
        searchVal: searchTerm,
        returnGeom: "Y",
        getAddrDetails: "Y",
        pageNum: 1,
      },
    });

    const addresses = response.data.results;
    return addresses;
  } catch (error) {
    console.error("Error fetching address:", error);
    throw new Error("Could not fetch address");
  }
};
