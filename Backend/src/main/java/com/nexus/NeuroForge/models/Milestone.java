package com.nexus.NeuroForge.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Milestone {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private LocalDate targetDate;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    public Milestone() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
}