package com.dothereco.DotheReco.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class UnfixedScheduleDTO {
    private Long unfixedCode;
    private String unfixedTitle;
    private LocalDate scheduleDate;
    private LocalTime unfixedTime;
    private LocalDate unfixedDeadline;
    private Integer unfixedImportance =3;
    private String unfixedMemo;
   // private Boolean reminderMark;
    private Long categoryId;
    private String placeName;
    private Double lat; // 위도 추가
    private Double lon; // 경도 추가
    private Boolean isKeyword;

}
