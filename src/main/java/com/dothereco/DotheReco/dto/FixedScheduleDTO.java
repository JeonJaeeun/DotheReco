package com.dothereco.DotheReco.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class FixedScheduleDTO {

    private Long fixedCode;
    @NotEmpty
    private String fixedTitle;

    private LocalDate fixedStartDay;

    private LocalDate fixedEndDay;

    private LocalTime fixedStartTime;

    private LocalTime fixedEndTime;

    private String fixedMemo;
    private Long categoryCode;
    //private Long placeCode;
    private String categoryName;
    private String categoryColor;
    private String placeName; // 새로 추가
    private Double lat; // 위도 추가
    private Double lon; // 경도 추가
}
