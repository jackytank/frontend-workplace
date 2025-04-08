package utils;

import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Gatherer;
import java.util.stream.Gatherers;

public class MyUtils {
    public enum Animal {
        WOLF, SHEEP, SHEEPDOG
    }

    public static Gatherer<Animal, ?, Boolean> isValidSeq() {
        final Predicate<List<Animal>> validTriplePredicate = triple -> {
            boolean hasSheep = triple.contains(Animal.SHEEP);
            boolean hasWolf = triple.contains(Animal.WOLF);
            boolean hasSheepDog = triple.contains(Animal.SHEEPDOG);

            return !(hasSheep && hasWolf && !hasSheepDog);
        };

        final var tripleWindowGatherer = Gatherers.<Animal>windowSliding(3);
        final var areAllTriplesValidGatherer = Gatherers.<List<Animal>, Boolean>fold(
                () -> true,
                (result, triple) -> result && validTriplePredicate.test(triple));
        return tripleWindowGatherer.andThen(areAllTriplesValidGatherer);

    }
}
