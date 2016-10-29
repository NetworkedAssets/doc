package com.networkedassets.util.functional;

import java.util.Optional;
import java.util.function.Function;
import java.util.function.Supplier;

/**
 * Utility class for dealing with Optionals
 */
public class Optionals {
    /**
     * Converts a throwing supplier to a optional with it's result value or none if it threw
     * @param supplier action that creates a value, but might throw an exception
     * @param <T> result type of the <code>supplier</code>
     * @return optional of a throwing supplier
     */
    public static <T> Optional<T> ofThrowing(Throwing.Supplier<T> supplier) {
        try {
            return Optional.of(supplier.get());
        } catch (Throwable t) {
            return Optional.empty();
        }
    }

    /**
     * Throwing version of {@link Optional#orElseGet(Supplier)}
     *
     * @param opt      option that is going to be or'ed
     * @param supplier this gives the default value when <code>opt</code> is not present;
     *                 unlike in the {@link Optional#orElseGet(Supplier)}, this may throw checked exceptions
     * @param <T>      type of return value
     * @param <E>      type of exception that might be thrown
     * @return like {@link Optional#orElseGet(Supplier)}
     * @throws E
     */
    public static <T, E extends Throwable> T orElseGetThrowing(Optional<T> opt, Throwing.Specific.Supplier<T, E> supplier) throws E {
        if (opt.isPresent()) return opt.get();
        else return supplier.get();
    }

    /** Throwing version of {@link Optional#map(Function)} */
    public static <T, R, E extends Throwable> Optional<R> mapThrowing(Optional<T> opt, Throwing.Specific.Function<T, R, E> function) throws E {
        if (opt.isPresent()) {
            return Optional.ofNullable(function.apply(opt.get()));
        } else {
            return Optional.empty();
        }
    }

    /** Throwing version of {@link Optional#flatMap(Function)} */
    public static <T, R, E extends Throwable> Optional<R> flatMapThrowing(Optional<T> opt, Throwing.Specific.Function<T, Optional<R>, E> function) throws E {
        if (opt.isPresent()) {
            return function.apply(opt.get());
        } else {
            return Optional.empty();
        }
    }

    /** Returns optional with the only value of the array */
    public static <T> Optional<T> fromArrayOfOne(T[] arr) {
        if (arr.length == 0) {
            return Optional.empty();
        } else if (arr.length > 1) {
            return Optional.empty();
        } else {
            return Optional.of(arr[0]);
        }
    }
}
