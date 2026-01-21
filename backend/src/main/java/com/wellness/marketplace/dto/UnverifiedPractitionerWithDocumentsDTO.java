package com.wellness.marketplace.dto;

import com.wellness.marketplace.model.PractitionerDocument;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnverifiedPractitionerWithDocumentsDTO {
    private Long userId;
    private String name;
    private String email;
    private String bio;
    private List<PractitionerDocument> documents;
}
