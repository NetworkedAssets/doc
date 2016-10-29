package com.networkedassets.util.functional;

/**
 * Taken from com.diffplug.durian
 */
public interface Throwing {
    /** Variations on the standard functional interfaces which throw a specific subclass of Throwable. */
    interface Specific {
        @FunctionalInterface
        interface Runnable<E extends Throwable> {
            void run() throws E;
        }

        @FunctionalInterface
        interface Supplier<T, E extends Throwable> {
            T get() throws E;
        }

        @FunctionalInterface
        interface Consumer<T, E extends Throwable> {
            void accept(T t) throws E;
        }

        @FunctionalInterface
        interface Function<T, R, E extends Throwable> {
            R apply(T t) throws E;
        }

        @FunctionalInterface
        interface Predicate<T, E extends Throwable> {
            boolean test(T t) throws E;
        }

        @FunctionalInterface
        interface BiConsumer<T, U, E extends Throwable> {
            void accept(T t, U u) throws E;
        }

        @FunctionalInterface
        interface BiFunction<T, U, R, E extends Throwable> {
            R apply(T t, U u) throws E;
        }

        @FunctionalInterface
        interface BiPredicate<T, U, E extends Throwable> {
            boolean accept(T t, U u) throws E;
        }
    }

    @FunctionalInterface
    interface Runnable extends Specific.Runnable<Throwable> {}

    @FunctionalInterface
    interface Supplier<T> extends Specific.Supplier<T, Throwable> {}

    @FunctionalInterface
    interface Consumer<T> extends Specific.Consumer<T, Throwable> {}

    @FunctionalInterface
    interface Function<T, R> extends Specific.Function<T, R, Throwable> {}

    @FunctionalInterface
    interface Predicate<T> extends Specific.Predicate<T, Throwable> {}

    @FunctionalInterface
    interface BiConsumer<T, U> extends Specific.BiConsumer<T, U, Throwable> {}

    @FunctionalInterface
    interface BiFunction<T, U, R> extends Specific.BiFunction<T, U, R, Throwable> {}

    @FunctionalInterface
    interface BiPredicate<T, U> extends Specific.BiPredicate<T, U, Throwable> {}

    static <T, R, E extends Throwable> java.util.function.Function<T, R> functionRethrowAsRuntimeException(Specific.Function<T, R, E> throwingFunction) {
        return t -> {
            try {
                return throwingFunction.apply(t);
            } catch (Throwable e) {
                if (e instanceof RuntimeException) {
                    throw (RuntimeException) e;
                } else {
                    throw new RuntimeException(e);
                }
            }
        };
    }

    static <T, E extends Throwable> java.util.function.Consumer<T> consumerRethrowAsRuntimeException(Specific.Consumer<T, E> cons) {
        return t -> {
            try {
                cons.accept(t);
            } catch (Throwable e) {
                if (e instanceof RuntimeException) throw (RuntimeException) e;
                throw new RuntimeException(e);
            }
        };
    }




    /**
     * Converts a throwing runnable to a optional with it's result value or none if it threw
     * @param runnable action that might throw an exception
     * @return weather the runnable threw anything
     */
    static boolean didThrow(Throwing.Runnable runnable) {
        try {
            runnable.run();
            return false;
        } catch (Throwable t) {
            return true;
        }
    }
}