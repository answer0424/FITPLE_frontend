import React, { useState, useEffect } from "react";

const KakaoSearch = ({ onPlaceSelect }) => {
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [displayedPlaces, setDisplayedPlaces] = useState([]);
  const [page, setPage] = useState(1); // 페이지 상태 관리

  useEffect(() => {
    const loadKakaoMapScript = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=234840c11186dc21ac264802aa3bb9c9&libraries=services&autoload=false";

      script.onload = () => {
        window.kakao.maps.load(() => {
          console.log("Kakao Maps SDK loaded");
        });
      };

      document.head.appendChild(script);
    };

    if (!window.kakao || !window.kakao.maps) {
      loadKakaoMapScript();
    }
  }, []);

  // 주소에 해당하는 위도와 경도를 가져오는 함수
  const getLatLngByAddress = (address) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const lat = result[0].y; // 위도
          const lng = result[0].x; // 경도
          resolve({ lat, lng });
        } else {
          reject("주소를 찾을 수 없습니다.");
        }
      });
    });
  };

  const searchPlaces = () => {
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, async (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 각 장소에 대해 위도와 경도를 추가하고 저장할 형식으로 가공
        const placesWithLatLng = await Promise.all(
          data.map(async (place) => {
            try {
              const { lat, lng } = await getLatLngByAddress(place.address_name);
              return {
                address: place.address_name,
                name: place.place_name,
                phone: place.phone,
                lat,
                lng,
              };
            } catch (error) {
              console.error(error);
              return {
                address: place.address_name,
                name: place.place_name,
                phone: place.phone,
                lat: null,
                lng: null,
              };
            }
          })
        );

        setPlaces(placesWithLatLng);
        setDisplayedPlaces(placesWithLatLng.slice(0, 5)); // 처음 5개만 표시
        setPage(2); // 페이지 초기화 (다음 5개부터 시작)
      } else {
        alert("검색 결과가 없습니다.");
        setPlaces([]);
        setDisplayedPlaces([]);
        setPage(1);
      }
    });
  };

  const loadMorePlaces = () => {
    const startIndex = (page - 1) * 5;
    const nextPlaces = places.slice(startIndex, startIndex + 5);
    setDisplayedPlaces([...displayedPlaces, ...nextPlaces]);
    setPage(page + 1); // 페이지 증가
  };

  const handlePlaceClick = (place) => {
    setKeyword(place.address); // 클릭한 장소의 주소를 검색창에 설정
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }

    // 배열에 저장 (주소, 위도, 경도)
    const placeInfo = [place.address, place.lat, place.lng];

    // 해당 장소 정보를 저장하려면 여기에 저장 로직을 추가 (예: 서버에 전송)
    console.log("저장된 장소 정보:", placeInfo);
  };

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            searchPlaces();
          }
        }}
        placeholder="검색어를 입력하세요"
      />
      <button onClick={searchPlaces}>검색</button>

      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginTop: "10px",
          padding: "10px",
          color: "black",
        }}
      >
        <h3>검색 결과</h3>
        {displayedPlaces.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {displayedPlaces.map((place, index) => (
              <li
                key={index}
                onClick={() => handlePlaceClick(place)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  borderBottom: "1px solid #eee",
                  color: "black",
                }}
              >
                <div>{place.name}</div>
                <div>{place.address}</div>
                {place.phone && <div>{place.phone}</div>}
              </li>
            ))}
          </ul>
        )}
        {places.length > displayedPlaces.length && (
          <button
            onClick={loadMorePlaces}
            style={{
              padding: "10px 20px",
              backgroundColor: "#A1D0FC",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px",
              fontSize: "14px",
            }}
          >
            더보기
          </button>
        )}
      </div>
    </div>
  );
};

export default KakaoSearch;
