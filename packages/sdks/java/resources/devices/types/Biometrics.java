/**
 * This file was auto-generated by Fern from our API Definition.
 */

package resources.devices.types;

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
import java.util.Objects;
import java.util.Optional;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonDeserialize(
    builder = Biometrics.Builder.class
)
public final class Biometrics {
  private final Optional<HeartRate> heartRate;

  private final Optional<HeartRateVariability> hrv;

  private final Optional<Respiration> respiration;

  private Biometrics(Optional<HeartRate> heartRate, Optional<HeartRateVariability> hrv,
      Optional<Respiration> respiration) {
    this.heartRate = heartRate;
    this.hrv = hrv;
    this.respiration = respiration;
  }

  @JsonProperty("heart_rate")
  public Optional<HeartRate> getHeartRate() {
    return heartRate;
  }

  @JsonProperty("hrv")
  public Optional<HeartRateVariability> getHrv() {
    return hrv;
  }

  @JsonProperty("respiration")
  public Optional<Respiration> getRespiration() {
    return respiration;
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) return true;
    return other instanceof Biometrics && equalTo((Biometrics) other);
  }

  private boolean equalTo(Biometrics other) {
    return heartRate.equals(other.heartRate) && hrv.equals(other.hrv) && respiration.equals(other.respiration);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.heartRate, this.hrv, this.respiration);
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
    private Optional<HeartRate> heartRate = Optional.empty();

    private Optional<HeartRateVariability> hrv = Optional.empty();

    private Optional<Respiration> respiration = Optional.empty();

    private Builder() {
    }

    public Builder from(Biometrics other) {
      heartRate(other.getHeartRate());
      hrv(other.getHrv());
      respiration(other.getRespiration());
      return this;
    }

    @JsonSetter(
        value = "heart_rate",
        nulls = Nulls.SKIP
    )
    public Builder heartRate(Optional<HeartRate> heartRate) {
      this.heartRate = heartRate;
      return this;
    }

    public Builder heartRate(HeartRate heartRate) {
      this.heartRate = Optional.of(heartRate);
      return this;
    }

    @JsonSetter(
        value = "hrv",
        nulls = Nulls.SKIP
    )
    public Builder hrv(Optional<HeartRateVariability> hrv) {
      this.hrv = hrv;
      return this;
    }

    public Builder hrv(HeartRateVariability hrv) {
      this.hrv = Optional.of(hrv);
      return this;
    }

    @JsonSetter(
        value = "respiration",
        nulls = Nulls.SKIP
    )
    public Builder respiration(Optional<Respiration> respiration) {
      this.respiration = respiration;
      return this;
    }

    public Builder respiration(Respiration respiration) {
      this.respiration = Optional.of(respiration);
      return this;
    }

    public Biometrics build() {
      return new Biometrics(heartRate, hrv, respiration);
    }
  }
}