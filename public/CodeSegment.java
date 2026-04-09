public class CodeSegment {
    public static void main(String[] args) {
        boolean a = true;
        boolean b = true;

        System.out.println((b || !(a || b)) + " ");
}