import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './css/addNormalCal.css'; // CSS 파일 import
import axios from 'axios'; // axios import


const categoryNames = {
    1: '학교수업',
    2: '과제',
    3: '팀플',
    4: '운동',
    5: '약속',
    6: '기타'
    // 필요에 따라 추가 카테고리를 여기에 정의
};

const AddNormalSchedulePage = () => {
    const location = useLocation();
    const [selectedPlace, setSelectedPlace] = useState('');
    const [categories, setCategories] = useState([]); // 추가: categories 상태 정의
    const [scheduleData, setScheduleData] = useState({
        fixedTitle: '',
        fixedStartDay: '',
        fixedEndDay: '',
        fixedStartTime: '',
        fixedEndTime: '',
        fixedMemo: '',
        categoryCode: '',
        placeName: '',
        lat: '', // 추가: 위도
        lon: '' // 추가: 경도
    });
    const [message, setMessage] = useState('');
    const [isTimeToggleOn, setIsTimeToggleOn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('카테고리 데이터를 가져오는 중 오류 발생:', error);
            });
    }, []);

    useEffect(() => {
        if (location.state) {
            const { place, lat, lon, scheduleData: previousData } = location.state;
            if (place) {
                setSelectedPlace(place);
                setScheduleData(prevData => ({
                    ...prevData,
                    placeName: place,
                    lat: lat || prevData.lat,
                    lon: lon || prevData.lon
                }));
            }
            if (previousData) {
                setScheduleData(previousData);
            }
        }
    }, [location.state]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setScheduleData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    /*
        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const formattedData = {
                    ...scheduleData,
                    fixedStartDay: scheduleData.fixedStartDay,
                    fixedEndDay: scheduleData.fixedEndDay,
                    fixedStartTime: scheduleData.fixedStartTime ? scheduleData.fixedStartTime + ":00" : "00:00:00",
                    fixedEndTime: scheduleData.fixedEndTime ? scheduleData.fixedEndTime + ":00" : "00:00:00",
                    categoryCode: scheduleData.categoryCode ? parseInt(scheduleData.categoryCode, 10) : null,
                    placeCode: scheduleData.placeCode ? parseInt(scheduleData.placeCode, 10) : null,
                };

                const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
                storedEvents.push(formattedData);
                localStorage.setItem('events', JSON.stringify(storedEvents));

                navigate('/Main', { state: { newEvent: formattedData } });
            } catch (error) {
                console.error('Error response:', error.response);
                setMessage('일정 추가에 실패했습니다. 서버 오류가 발생했습니다.');
            }
        };*/

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        const selectedCategory = categories.find(category => category.id === parseInt(value, 10));
        setScheduleData((prevData) => ({
            ...prevData,
            categoryCode: value,
            categoryColor: selectedCategory ? selectedCategory.color : ''
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const categoryCode = Object.keys(categoryNames).find(key => categoryNames[key] === scheduleData.categoryCode);

            const formattedData = {
                ...scheduleData,
                fixedStartDay: scheduleData.fixedStartDay,
                fixedEndDay: scheduleData.fixedEndDay,
                fixedStartTime: scheduleData.fixedStartTime ? scheduleData.fixedStartTime + ":00" : "00:00:00",
                fixedEndTime: scheduleData.fixedEndTime ? scheduleData.fixedEndTime + ":00" : "00:00:00",
                categoryCode: scheduleData.categoryCode ? parseInt(scheduleData.categoryCode, 10) : null,

                placeName: scheduleData.placeName, // placeName으로 수정
                lat: scheduleData.lat, // 위도 추가
                lon: scheduleData.lon // 경도 추가
                //placeCode: scheduleData.placeCode ? parseInt(scheduleData.placeCode, 10) : null,

            };

            await axios.post('http://localhost:8080/api/fixed', formattedData); // 백엔드 서버로 데이터 전송
            navigate('/Main', { state: { newEvent: formattedData } });
        } catch (error) {
            console.error('Error response:', error.response);
            setMessage('일정 추가에 실패했습니다. 서버 오류가 발생했습니다.');
        }
    };


    const handleToggleChange = () => {
        setIsTimeToggleOn(!isTimeToggleOn);
    };

    useEffect(() => {
        const startDateConfig = {
            dateFormat: "Y-m-d",
            onChange: (selectedDates, dateStr) => {
                setScheduleData(prevData => ({
                    ...prevData,
                    fixedStartDay: dateStr,
                }));
            },
        };
        flatpickr("input.startdate-picker", startDateConfig);

        const endDateConfig = {
            dateFormat: "Y-m-d",
            onChange: (selectedDates, dateStr) => {
                setScheduleData(prevData => ({
                    ...prevData,
                    fixedEndDay: dateStr,
                }));
            },
        };
        flatpickr("input.enddate-picker", endDateConfig);

        if (isTimeToggleOn) {
            const startTimeConfig = {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                onChange: (selectedDates, dateStr) => {
                    setScheduleData(prevData => ({
                        ...prevData,
                        fixedStartTime: dateStr,
                    }));
                },
            };
            flatpickr("input.starttime-picker", startTimeConfig);

            const endTimeConfig = {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                onChange: (selectedDates, dateStr) => {
                    setScheduleData(prevData => ({
                        ...prevData,
                        fixedEndTime: dateStr,
                    }));
                },
            };
            flatpickr("input.endtime-picker", endTimeConfig);
        }
    }, [isTimeToggleOn]);

    const handlePlaceInputClick = () => {
        navigate('/Map', { state: { from: '/AddNormalSchedule',scheduleData } });
    };

    const goToMain=()=>{
        navigate('/main')
    }

    return (
        <div className="addNor-gray-box">
            <button type="button" className="addNor-back-button" onClick={goToMain}>
                &lt;
            </button>
            <button type="submit" className="addNor-submit" form="addNor-form">완료</button>
            <h1 className="addNor-h1">일반스케줄 추가</h1>
            <form className="addNor-form" id="addNor-form" onSubmit={handleSubmit}>
                <div className="addNor-container">
                    <div className="addNor-input-container">
                        <label htmlFor="fixedTitle">제목</label>
                        <input type="text" className="fixedTitle" name="fixedTitle" id="fixedTitle" placeholder="제목"
                               value={scheduleData.fixedTitle} onChange={handleInputChange} required/>
                    </div>
                    <div className="addNor-input-container">
                        <label>날짜 및 시간</label>
                        <div className="addNor-time-toggle">
                            <span>시간 설정</span>
                            <input className="addNor-time-toggle" role="switch" type="checkbox" id="addNor-time-toggle"
                                   checked={isTimeToggleOn} onChange={handleToggleChange}/>
                        </div>
                        <div className={`addNor-date-picker ${isTimeToggleOn ? 'hidden' : ''}`} id="addNor-date-picker">
                            <input className="startdate-picker" name="fixedStartDay" id="fixedStartDay" type="text"
                                   placeholder="시작 날짜" value={scheduleData.fixedStartDay} onChange={handleInputChange}/>
                            <span className="date-range-divider">~</span>
                            <input className="enddate-picker" name="fixedEndDay" id="fixedEndDay" type="text"
                                   placeholder="종료 날짜" value={scheduleData.fixedEndDay} onChange={handleInputChange}/>
                        </div>
                        <div className={`addNor-datetime-picker ${isTimeToggleOn ? '' : 'hidden'}`}
                             id="addNor-datetime-picker">
                            <input className="startdate-picker" name="fixedStartDay" id="fixedStartDay" type="text"
                                   placeholder="시작 날짜" value={scheduleData.fixedStartDay} onChange={handleInputChange}/>
                            <input className="starttime-picker" name="fixedStartTime" id="fixedStartTime" type="text"
                                   placeholder="시작 시간" value={scheduleData.fixedStartTime}
                                   onChange={handleInputChange}/>
                            <span className="date-range-divider">~</span>
                            <input className="enddate-picker" name="fixedEndDay" id="fixedEndDay" type="text"
                                   placeholder="종료 날짜" value={scheduleData.fixedEndDay} onChange={handleInputChange}/>
                            <input className="endtime-picker" name="fixedEndTime" id="fixedEndTime" type="text"
                                   placeholder="종료 시간" value={scheduleData.fixedEndTime} onChange={handleInputChange}/>
                        </div>
                    </div>
                    <div className="addFlex-input-container">
                        <label htmlFor="placeName">장소</label>
                        <input type="text" name="placeName" value={scheduleData.placeName}
                               placeholder="장소를 입력하세요."
                               onChange={handleInputChange} onClick={handlePlaceInputClick}/>
                    </div>
                    {/**  <div className="addNor-input-container">
                        <label>카테고리</label>
                        <input type="text" className="categoryCode" name="categoryCode" id="categoryCode"
                               placeholder="카테고리를 입력하세요"
                               value={scheduleData.categoryCode} onChange={handleInputChange} required/>
                    </div> **/}
                    <div className="addNor-input-container">
                        <label>카테고리</label>
                        <select className="categoryCode" name="categoryCode" id="categoryCode"
                                value={scheduleData.categoryCode} onChange={handleInputChange} required>
                            <option value="">카테고리를 선택하세요</option>
                            {Object.keys(categoryNames).map(categoryCode => (
                                <option key={categoryCode} value={categoryCode}>{categoryNames[categoryCode]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="addNor-input-container">
                        <label>메모</label>
                        <textarea className="fixedMemo" name="fixedMemo" id="memo" rows="4" placeholder="메모"
                                  value={scheduleData.fixedMemo} onChange={handleInputChange}></textarea>
                    </div>
                    {scheduleData.lat && scheduleData.lon && (
                        <div className="addNor-input-container">
                            <label>위치 정보</label>
                            <p>위도: {scheduleData.lat}</p>
                            <p>경도: {scheduleData.lon}</p>
                        </div>
                    )}
                </div>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default AddNormalSchedulePage;