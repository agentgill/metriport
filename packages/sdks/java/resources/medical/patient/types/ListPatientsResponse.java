/**
 * This file was auto-generated by Fern from our API Definition.
 */

package resources.medical.patient.types;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import core.ObjectMappers;
import java.lang.Object;
import java.lang.Override;
import java.lang.String;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonDeserialize(
    builder = ListPatientsResponse.Builder.class
)
public final class ListPatientsResponse {
  private final List<Patient> patients;

  private ListPatientsResponse(List<Patient> patients) {
    this.patients = patients;
  }

  @JsonProperty("patients")
  public List<Patient> getPatients() {
    return patients;
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) return true;
    return other instanceof ListPatientsResponse && equalTo((ListPatientsResponse) other);
  }

  private boolean equalTo(ListPatientsResponse other) {
    return patients.equals(other.patients);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.patients);
  }

  @Override
  public String toString() {
    return ObjectMappers.stringify(this);
  }

  public static Builder builder() {
    return new Builder();
  }

  @JsonIgnoreProperties(
      ignoreUnknown = true
  )
  public static final class Builder {
    private List<Patient> patients = new ArrayList<>();

    private Builder() {
    }

    public Builder from(ListPatientsResponse other) {
      patients(other.getPatients());
      return this;
    }

    @JsonSetter(
        value = "patients",
        nulls = Nulls.SKIP
    )
    public Builder patients(List<Patient> patients) {
      this.patients.clear();
      this.patients.addAll(patients);
      return this;
    }

    public Builder addPatients(Patient patients) {
      this.patients.add(patients);
      return this;
    }

    public Builder addAllPatients(List<Patient> patients) {
      this.patients.addAll(patients);
      return this;
    }

    public ListPatientsResponse build() {
      return new ListPatientsResponse(patients);
    }
  }
}